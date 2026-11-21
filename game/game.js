/* Lantern Lane — game state, timer, scoring, hints, levels and overlays.
   One clear job: run the game. The pictures come from scenes.js, the paint
   from render.js, the sounds from audio.js. */
(function () {
  var levels = window.SCENES;
  var render = window.LanternRender;
  var audio = window.LanternAudio;

  var state = {
    level: 0,
    unlocked: 0,
    found: {},
    score: 0,
    clicks: 0,
    wrong: 0,
    timeLeft: 0,
    hintsLeft: 3,
    timerId: null,
    over: false,
    frozen: false // ?shot= presets freeze the timer for deterministic screenshots
  };

  function $(id) { return document.getElementById(id); }

  function currentLevel() { return levels[state.level]; }

  function updateHud() {
    var level = currentLevel();
    var foundCount = Object.keys(state.found).length;
    $('level-name').textContent = 'Level ' + (state.level + 1) + ' · ' + level.name;
    $('counter').textContent = 'Found ' + foundCount + ' / ' + level.diffs.length;
    $('score').textContent = 'Score ' + state.score;
    $('timer-text').textContent = state.timeLeft + 's';
    var bar = $('timer-bar');
    bar.style.width = Math.max(0, (state.timeLeft / level.time) * 100) + '%';
    bar.classList.toggle('low', state.timeLeft <= 30);
    $('hint-btn').textContent = '💡 Hint (' + state.hintsLeft + ')';
    $('hint-btn').disabled = state.hintsLeft <= 0 || state.over;
    document.querySelectorAll('.level-btn').forEach(function (btn) {
      var i = Number(btn.dataset.level);
      btn.classList.toggle('active', i === state.level);
      btn.classList.toggle('locked', i > state.unlocked);
      btn.textContent = (i + 1) + ' · ' + levels[i].name + (i > state.unlocked ? ' 🔒' : '');
    });
  }

  function stopTimer() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
  }

  function startTimer() {
    stopTimer();
    if (state.frozen) return;
    state.timerId = setInterval(function () {
      state.timeLeft -= 1;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        updateHud();
        timeUp();
        return;
      }
      updateHud();
    }, 1000);
  }

  function startLevel(index) {
    state.level = index;
    state.found = {};
    state.clicks = 0;
    state.wrong = 0;
    state.timeLeft = currentLevel().time;
    state.hintsLeft = 3;
    state.over = false;
    hideOverlay();
    render.renderLevel(currentLevel(), new Set());
    startTimer();
    updateHud();
    setMessage('Find all ' + currentLevel().diffs.length + ' differences — click one on either picture.');
  }

  function setMessage(text) { $('message').textContent = text; }

  function nearestDiff(x, y) {
    var level = currentLevel();
    var best = -1, bestD = 1e9;
    for (var i = 0; i < level.diffs.length; i++) {
      if (state.found[i]) continue;
      var d = level.diffs[i];
      var dist = Math.hypot(x - d.x, y - d.y) - d.r;
      if (dist < bestD) { bestD = dist; best = i; }
    }
    return bestD <= 10 ? best : -1;
  }

  function onPanelClick(event, holderId) {
    if (state.over) return;
    var pt = render.eventToScene(event, holderId);
    var idx = nearestDiff(pt.x, pt.y);
    state.clicks += 1;
    if (idx >= 0) {
      state.found[idx] = true;
      render.paintMark(idx, currentLevel());
      audio.playFind();
      state.score += 100;
      var left = currentLevel().diffs.length - Object.keys(state.found).length;
      setMessage('Found it — ' + currentLevel().diffs[idx].label + '! ' + left + ' to go.');
      updateHud();
      if (left === 0) levelComplete();
    } else {
      state.wrong += 1;
      state.timeLeft = Math.max(0, state.timeLeft - 3);
      audio.playWrong();
      render.shake(holderId);
      setMessage('Not quite — that costs 3 seconds. Look closer!');
      updateHud();
      if (state.timeLeft <= 0) timeUp();
    }
  }

  function useHint() {
    if (state.over || state.hintsLeft <= 0) return;
    var level = currentLevel();
    var remaining = [];
    for (var i = 0; i < level.diffs.length; i++) if (!state.found[i]) remaining.push(i);
    if (!remaining.length) return;
    var pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.timeLeft = Math.max(0, state.timeLeft - 10);
    audio.playHint();
    render.pulseHint(pick, level);
    setMessage('Hint: look near the ' + level.diffs[pick].label + '… (costs 10 seconds)');
    updateHud();
    if (state.timeLeft <= 0) timeUp();
  }

  function starsFor() {
    if (state.wrong === 0) return 3;
    if (state.wrong <= 2) return 2;
    return 1;
  }

  function levelComplete() {
    state.over = true;
    stopTimer();
    audio.playWin();
    var bonus = state.timeLeft * 2;
    state.score += bonus;
    var stars = starsFor();
    var accuracy = state.clicks ? Math.round((Object.keys(state.found).length / state.clicks) * 100) : 100;
    var last = state.level === levels.length - 1;
    if (!last) state.unlocked = Math.max(state.unlocked, state.level + 1);
    showOverlay(
      last ? '🎉 You found them all!' : '🎉 Level clear!',
      last
        ? 'You finished every scene in Lantern Lane. Come back and beat your score!'
        : 'Every difference in ' + currentLevel().name + ' is found.',
      '<div class="stars">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>' +
      'Time left: ' + state.timeLeft + 's (bonus +' + bonus + ')<br>' +
      'Accuracy: ' + accuracy + '% · Wrong clicks: ' + state.wrong + '<br>' +
      'Total score: ' + state.score,
      last ? 'Play again' : 'Next level →',
      function () {
        if (last) startLevel(0);
        else startLevel(state.level + 1);
      }
    );
    updateHud();
  }

  function timeUp() {
    if (state.over) return;
    state.over = true;
    stopTimer();
    audio.playWrong();
    var foundCount = Object.keys(state.found).length;
    showOverlay(
      '⏰ Time’s up!',
      'You found ' + foundCount + ' of ' + currentLevel().diffs.length + ' differences in ' + currentLevel().name + '.',
      'Score so far: ' + state.score,
      'Try again',
      function () { startLevel(state.level); }
    );
  }

  function showOverlay(title, text, statsHtml, btnText, onBtn) {
    $('overlay-title').textContent = title;
    $('overlay-text').textContent = text;
    $('overlay-stats').innerHTML = statsHtml || '';
    var btn = $('overlay-btn');
    btn.textContent = btnText;
    btn.onclick = onBtn;
    $('overlay').classList.remove('hidden');
  }

  function hideOverlay() { $('overlay').classList.add('hidden'); }

  function showStart() {
    state.over = true;
    showOverlay(
      '🏮 Lantern Lane',
      'Two pictures, one lane, a handful of sneaky differences. Find them all before the lanterns burn down — three scenes, 7, 9 and 12 differences.',
      'Click a difference on either picture.<br>💡 Hint costs 10s · wrong click costs 3s · H / R keys work too.',
      'Start playing →',
      function () { startLevel(state.level); }
    );
  }

  function applyShotPreset(shot) {
    state.frozen = true;
    if (shot === 'play') {
      startLevel(0);
      [0, 1, 2].forEach(function (i) {
        state.found[i] = true;
        render.paintMark(i, currentLevel());
      });
      state.timeLeft = 150;
      state.score = 300;
      state.clicks = 3;
      updateHud();
      setMessage('Found 3 / 7 — keep hunting, 4 differences are still hiding.');
    } else if (shot === 'results') {
      startLevel(0);
      currentLevel().diffs.forEach(function (_, i) { state.found[i] = true; });
      state.timeLeft = 62;
      state.score = 824;
      state.clicks = 7;
      state.over = true;
      stopTimer();
      render.renderLevel(currentLevel(), new Set(Object.keys(state.found).map(Number)));
      showOverlay(
        '🎉 Level clear!',
        'Every difference in The Dumpling Stall is found.',
        '<div class="stars">★★★</div>Time left: 62s (bonus +124)<br>Accuracy: 100% · Wrong clicks: 0<br>Total score: 824',
        'Next level →',
        function () { startLevel(1); }
      );
      updateHud();
    } else if (shot === 'level2') {
      startLevel(1);
      [0, 4].forEach(function (i) {
        state.found[i] = true;
        render.paintMark(i, currentLevel());
      });
      state.timeLeft = 118;
      state.score = 500;
      state.clicks = 2;
      updateHud();
      setMessage('Found 2 / 9 — the lantern shop hides seven more.');
    } else {
      showStart();
    }
  }

  // A scripted self-test (?selftest=1): plays a few moves and reports.
  function runSelfTest() {
    var out = [];
    function log(line) { out.push(line); }
    function finish() {
      var el = $('selftest-output');
      el.style.display = 'block';
      el.textContent = out.join(' | ');
      document.title = 'SELFTEST ' + out.join(' | ');
    }
    setTimeout(function () {
      try {
        // Start playing for real first: without ?shot= the start overlay
        // is up and clicks are ignored, so the test must begin a level.
        startLevel(0);
        var level = currentLevel();
        // Three correct clicks, straight through the handler.
        [0, 1, 2].forEach(function (i) {
          var d = level.diffs[i];
          var fake = { clientX: 0, clientY: 0 };
          var svg = document.querySelector('#holder-a svg');
          var rect = svg.getBoundingClientRect();
          fake.clientX = rect.left + (d.x / 640) * rect.width;
          fake.clientY = rect.top + (d.y / 420) * rect.height;
          onPanelClick(fake, 'holder-a');
        });
        log('found=' + Object.keys(state.found).length);
        log('counter=' + $('counter').textContent);
        // One wrong click in empty sky.
        var svg2 = document.querySelector('#holder-a svg');
        var r2 = svg2.getBoundingClientRect();
        onPanelClick({ clientX: r2.left + 10, clientY: r2.top + 10 }, 'holder-a');
        log('wrong=' + state.wrong);
        log('timeLeft=' + state.timeLeft);
        // One hint.
        var before = state.hintsLeft;
        useHint();
        log('hints=' + before + '->' + state.hintsLeft);
        // Finish the level.
        level.diffs.forEach(function (_, i) {
          if (!state.found[i]) {
            var d = level.diffs[i];
            var svg3 = document.querySelector('#holder-b svg');
            var r3 = svg3.getBoundingClientRect();
            onPanelClick({
              clientX: r3.left + (d.x / 640) * r3.width,
              clientY: r3.top + (d.y / 420) * r3.height
            }, 'holder-b');
          }
        });
        log('complete=' + state.over);
        log('overlayVisible=' + !$('overlay').classList.contains('hidden'));
        log('score=' + state.score);
        log('PASS');
      } catch (e) {
        log('ERROR ' + e.message);
      }
      finish();
    }, 600);
  }

  function init() {
    var params = new URLSearchParams(window.location.search);
    $('hint-btn').addEventListener('click', useHint);
    $('restart-btn').addEventListener('click', function () { startLevel(state.level); });
    $('mute-btn').addEventListener('click', function () {
      audio.setMuted(!audio.isMuted());
      $('mute-btn').textContent = audio.isMuted() ? '🔇' : '🔊';
    });
    document.querySelectorAll('.level-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.dataset.level);
        if (i <= state.unlocked) startLevel(i);
      });
    });
    $('holder-a').addEventListener('click', function (e) { onPanelClick(e, 'holder-a'); });
    $('holder-b').addEventListener('click', function (e) { onPanelClick(e, 'holder-b'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'h' || e.key === 'H') useHint();
      if (e.key === 'r' || e.key === 'R') startLevel(state.level);
      if (e.key >= '1' && e.key <= '3') {
        var i = Number(e.key) - 1;
        if (i <= state.unlocked) startLevel(i);
      }
    });

    var shot = params.get('shot');
    if (shot) {
      applyShotPreset(shot);
    } else {
      state.level = 0;
      state.timeLeft = currentLevel().time;
      render.renderLevel(currentLevel(), new Set());
      updateHud();
      showStart();
    }
    if (params.get('selftest') === '1') runSelfTest();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
