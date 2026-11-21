/* Lantern Lane — WebAudio chimes. No audio files: every sound is synthesized. */
(function () {
  var ctx = null;
  var muted = false;

  function ensureCtx() {
    if (!ctx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, startAt, duration, type, volume) {
    var ac = ensureCtx();
    if (!ac || muted) return;
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
    gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(volume || 0.18, ac.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + startAt);
    osc.stop(ac.currentTime + startAt + duration + 0.05);
  }

  // A bright two-note chime when a difference is found.
  function playFind() {
    tone(880, 0, 0.22, 'sine', 0.20);
    tone(1318.5, 0.09, 0.30, 'sine', 0.16);
  }

  // A soft low thud for a wrong click.
  function playWrong() {
    tone(180, 0, 0.18, 'triangle', 0.14);
  }

  // A short rising arpeggio when a level is cleared.
  function playWin() {
    tone(523.25, 0, 0.18, 'sine', 0.18);
    tone(659.25, 0.10, 0.18, 'sine', 0.18);
    tone(783.99, 0.20, 0.22, 'sine', 0.18);
    tone(1046.5, 0.30, 0.34, 'sine', 0.18);
  }

  // A gentle two-note cue for a hint.
  function playHint() {
    tone(1046.5, 0, 0.14, 'sine', 0.12);
    tone(783.99, 0.08, 0.18, 'sine', 0.12);
  }

  function setMuted(value) { muted = !!value; }
  function isMuted() { return muted; }

  window.LanternAudio = {
    playFind: playFind,
    playWrong: playWrong,
    playWin: playWin,
    playHint: playHint,
    setMuted: setMuted,
    isMuted: isMuted
  };
})();
