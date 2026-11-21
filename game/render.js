/* Lantern Lane — renders a level's two panels and paints the markers.
   Both panels come from the same scene code; the right one is variant 'B',
   so the pictures are near-identical except for the differences. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var W = 640, H = 420;

  function svgEl(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  // Draws both panels for a level. found is a Set of found difference indexes.
  function renderLevel(level, found) {
    var holderA = document.getElementById('holder-a');
    var holderB = document.getElementById('holder-b');
    holderA.innerHTML = '<svg viewBox="0 0 640 420" data-variant="A">' + level.draw('A') + '</svg>';
    holderB.innerHTML = '<svg viewBox="0 0 640 420" data-variant="B">' + level.draw('B') + '</svg>';
    found.forEach(function (i) { paintMark(i, level); });
  }

  // Paints a found-difference ring + tick on BOTH panels.
  function paintMark(index, level) {
    var d = level.diffs[index];
    ['holder-a', 'holder-b'].forEach(function (id) {
      var svg = document.getElementById(id).querySelector('svg');
      if (!svg) return;
      var g = svgEl('g', {});
      g.appendChild(svgEl('circle', { cx: d.x, cy: d.y, r: d.r + 4, 'class': 'mark-ring' }));
      var x = d.x, y = d.y, r = d.r;
      g.appendChild(svgEl('path', {
        'class': 'mark-tick',
        d: 'M ' + (x - r * 0.45) + ' ' + y + ' L ' + (x - r * 0.1) + ' ' + (y + r * 0.35) + ' L ' + (x + r * 0.5) + ' ' + (y - r * 0.35)
      }));
      svg.appendChild(g);
    });
  }

  // Briefly pulses one unfound difference on both panels (a hint).
  function pulseHint(index, level) {
    var d = level.diffs[index];
    ['holder-a', 'holder-b'].forEach(function (id) {
      var svg = document.getElementById(id).querySelector('svg');
      if (!svg) return;
      var c = svgEl('circle', { cx: d.x, cy: d.y, r: d.r + 6, 'class': 'hint-ring' });
      svg.appendChild(c);
      setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 2800);
    });
  }

  // Converts a mouse event on a panel into scene coordinates (640x420 space).
  function eventToScene(event, holderId) {
    var svg = document.getElementById(holderId).querySelector('svg');
    var rect = svg.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * W / rect.width,
      y: (event.clientY - rect.top) * H / rect.height
    };
  }

  function shake(holderId) {
    var holder = document.getElementById(holderId);
    holder.classList.remove('shake');
    void holder.offsetWidth; // restart the animation
    holder.classList.add('shake');
  }

  window.LanternRender = {
    renderLevel: renderLevel,
    paintMark: paintMark,
    pulseHint: pulseHint,
    eventToScene: eventToScene,
    shake: shake
  };
})();
