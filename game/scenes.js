/* Lantern Lane — scene definitions.
   Every scene is drawn twice from the same code: variant 'A' is the original,
   variant 'B' is the same picture with each difference applied. A difference
   is a real drawn element (never a pixel tweak), and each one has a hotspot
   the game uses for click detection. All art is drawn here, in-session. */

(function () {
  var W = 640, H = 420;

  function sky(variant) {
    var s = '';
    s += '<rect x="0" y="0" width="640" height="300" fill="#1b2340"/>';
    s += '<rect x="0" y="300" width="640" height="120" fill="#2e2118"/>';
    var stars = [[40, 40], [120, 70], [200, 30], [330, 55], [420, 35], [500, 80], [600, 45], [80, 120], [260, 100], [470, 120]];
    for (var i = 0; i < stars.length; i++) {
      s += '<circle cx="' + stars[i][0] + '" cy="' + stars[i][1] + '" r="2.2" fill="#f4ead8" opacity="0.85"/>';
    }
    return s;
  }

  function moon(cx, cy, variant) {
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="26" fill="#f6e7b8"/>';
    s += '<circle cx="' + (cx - 8) + '" cy="' + (cy - 5) + '" r="4" fill="#e0c98f"/>';
    s += '<circle cx="' + (cx + 7) + '" cy="' + (cy + 8) + '" r="3" fill="#e0c98f"/>';
    return s;
  }

  /* ---------------- Level 1: The Dumpling Stall ---------------- */
  function drawStall(variant) {
    var B = variant === 'B';
    var s = sky(variant);
    s += moon(560, 55, variant);
    // String lights across the top.
    s += '<path d="M20 28 Q320 70 620 30" stroke="#8a7a5a" stroke-width="2" fill="none"/>';
    var bulbs = [[90, 40], [190, 48], [290, 50], [390, 48], [490, 42], [580, 34]];
    for (var i = 0; i < bulbs.length; i++) {
      s += '<circle cx="' + bulbs[i][0] + '" cy="' + (bulbs[i][1] + 8) + '" r="6" fill="#ffd97a"/>';
      s += '<line x1="' + bulbs[i][0] + '" y1="' + bulbs[i][1] + '" x2="' + bulbs[i][0] + '" y2="' + (bulbs[i][1] + 4) + '" stroke="#8a7a5a" stroke-width="2"/>';
    }
    // The bird on the wire (difference 7: gone in B).
    if (!B) {
      s += '<g><ellipse cx="300" cy="40" rx="9" ry="6" fill="#3a4668"/>';
      s += '<circle cx="307" cy="36" r="4" fill="#3a4668"/>';
      s += '<path d="M311 36 l6 2 -6 2 z" fill="#ffb347"/></g>';
    }
    // Back wall, lighter than the sky so the stall reads against it,
    // with its window on the left, clear of the awning (difference 6:
    // the window is lit in A, dark in B).
    s += '<rect x="30" y="140" width="580" height="160" fill="#333d63"/>';
    s += '<rect x="60" y="165" width="60" height="55" fill="' + (B ? '#141a30' : '#ffd97a') + '" stroke="#0f1530" stroke-width="4"/>';
    s += '<line x1="90" y1="165" x2="90" y2="220" stroke="#0f1530" stroke-width="3"/>';
    s += '<line x1="60" y1="192" x2="120" y2="192" stroke="#0f1530" stroke-width="3"/>';
    // Sign board (difference 3: the price is 8 in A, 6 in B).
    s += '<rect x="270" y="150" width="100" height="44" rx="6" fill="#f4ead8" stroke="#8a5a35" stroke-width="3"/>';
    s += '<text x="320" y="172" font-size="20" font-weight="bold" text-anchor="middle" fill="#7a2a20">' + (B ? '6' : '8') + ' coins</text>';
    s += '<text x="320" y="188" font-size="11" text-anchor="middle" fill="#5a4632">DUMPLINGS</text>';
    // Awning stripes (difference 4: the middle red stripe is missing in B).
    var stripeCols = ['#e2574c', '#f4ead8', '#e2574c', '#f4ead8', '#e2574c'];
    for (var a = 0; a < 5; a++) {
      var col = stripeCols[a];
      if (B && a === 2) col = '#f4ead8';
      s += '<rect x="' + (150 + a * 88) + '" y="205" width="88" height="50" fill="' + col + '"/>';
    }
    s += '<rect x="142" y="251" width="456" height="8" fill="#c98a4a"/>';
    // Stall counter.
    s += '<rect x="150" y="290" width="440" height="14" fill="#a06a3f"/>';
    s += '<rect x="160" y="304" width="420" height="56" fill="#7a4a2b"/>';
    s += '<rect x="160" y="304" width="420" height="8" fill="#8a5a35"/>';
    // Steamer baskets with dumplings (difference 5: three dumplings in A, two in B).
    s += '<rect x="200" y="266" width="70" height="12" rx="4" fill="#c98a4a"/>';
    s += '<rect x="200" y="278" width="70" height="12" rx="4" fill="#b5763e"/>';
    s += '<ellipse cx="218" cy="262" rx="11" ry="7" fill="#fff3d6"/>';
    s += '<ellipse cx="240" cy="260" rx="11" ry="7" fill="#fff3d6"/>';
    if (!B) s += '<ellipse cx="256" cy="264" rx="10" ry="6" fill="#fff3d6"/>';
    // Hanging lantern below the awning's right end, with its tassel
    // (difference 1: the tassel is missing in B).
    s += '<line x1="560" y1="255" x2="560" y2="268" stroke="#8a7a5a" stroke-width="2"/>';
    s += '<ellipse cx="560" cy="284" rx="18" ry="20" fill="#e2574c"/>';
    s += '<rect x="554" y="262" width="12" height="5" fill="#ffb347"/>';
    if (!B) {
      s += '<line x1="560" y1="304" x2="560" y2="318" stroke="#ffb347" stroke-width="3"/>';
      s += '<circle cx="560" cy="321" r="3" fill="#ffb347"/>';
    }
    // The cat on the counter (difference 2: orange in A, grey in B).
    var catCol = B ? '#8a8f98' : '#e07830';
    s += '<ellipse cx="480" cy="282" rx="24" ry="15" fill="' + catCol + '"/>';
    s += '<circle cx="498" cy="266" r="12" fill="' + catCol + '"/>';
    s += '<path d="M490 256 l4 -8 4 8 z M502 256 l4 -8 4 8 z" fill="' + catCol + '"/>';
    s += '<circle cx="494" cy="264" r="1.8" fill="#241a08"/><circle cx="502" cy="264" r="1.8" fill="#241a08"/>';
    s += '<path d="M506 278 q10 -4 12 -14" stroke="' + catCol + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
    // Flower pot on the ground.
    s += '<path d="M116 335 h28 l-4 26 h-20 z" fill="#b04a3a"/>';
    s += '<circle cx="126" cy="327" r="7" fill="#7ee081"/><circle cx="136" cy="323" r="7" fill="#7ee081"/><circle cx="130" cy="317" r="6" fill="#ff8ab0"/>';
    return s;
  }

  /* ---------------- Level 2: The Paper Lantern Shop ---------------- */
  function drawShop(variant) {
    var B = variant === 'B';
    var s = sky(variant);
    s += moon(70, 55, variant);
    // Shop building and roof.
    s += '<rect x="70" y="120" width="500" height="200" fill="#3a2f4a"/>';
    s += '<polygon points="50,120 590,120 560,78 80,78" fill="#b04a3a"/>';
    // One roof tile changes colour (difference 8).
    s += '<rect x="188" y="86" width="24" height="26" fill="' + (B ? '#4fd1c5' : '#8a3527') + '"/>';
    s += '<rect x="236" y="86" width="24" height="26" fill="#8a3527"/>';
    s += '<rect x="284" y="86" width="24" height="26" fill="#8a3527"/>';
    // The cat asleep on the roof (difference 9: gone in B).
    if (!B) {
      s += '<ellipse cx="470" cy="74" rx="20" ry="9" fill="#e07830"/>';
      s += '<circle cx="486" cy="70" r="8" fill="#e07830"/>';
      s += '<path d="M480 63 l3 -6 3 6 z" fill="#e07830"/>';
    }
    // Shop sign (difference 6: LANTERNS in A, LANTERN in B).
    s += '<rect x="230" y="56" width="180" height="34" rx="6" fill="#f4ead8" stroke="#8a5a35" stroke-width="3"/>';
    s += '<text x="320" y="79" font-size="17" font-weight="bold" text-anchor="middle" fill="#7a2a20">PAPER ' + (B ? 'LANTERN' : 'LANTERNS') + '</text>';
    // Lantern row (difference 1: the middle lantern is red in A, teal in B).
    var cols = ['#e2574c', '#ffb347', '#e2574c', '#ff8ab0', '#ffb347'];
    var xs = [110, 190, 270, 350, 430];
    for (var i = 0; i < 5; i++) {
      var c = cols[i];
      if (B && i === 2) c = '#4fd1c5';
      s += '<line x1="' + xs[i] + '" y1="120" x2="' + xs[i] + '" y2="132" stroke="#8a7a5a" stroke-width="2"/>';
      s += '<ellipse cx="' + xs[i] + '" cy="148" rx="16" ry="18" fill="' + c + '"/>';
      s += '<rect x="' + (xs[i] - 5) + '" y="128" width="10" height="4" fill="#ffd97a"/>';
    }
    // Paper crane mobile (difference 2: gone in B).
    if (!B) {
      s += '<line x1="500" y1="120" x2="500" y2="140" stroke="#8a7a5a" stroke-width="2"/>';
      s += '<polygon points="500,142 486,158 500,152 514,158" fill="#f4ead8"/>';
      s += '<polygon points="500,142 492,130 500,138 508,130" fill="#d8e8f4"/>';
    }
    // Window display with a vase (difference 7: the vase is missing in B).
    s += '<rect x="110" y="200" width="110" height="90" fill="#ffd97a" stroke="#0f1530" stroke-width="4"/>';
    s += '<line x1="165" y1="200" x2="165" y2="290" stroke="#0f1530" stroke-width="3"/>';
    if (!B) {
      s += '<path d="M158 272 q-6 -14 0 -20 q6 6 0 20 z" fill="#4f7ec2"/>';
      s += '<path d="M172 272 q-6 -14 0 -20 q6 6 0 20 z" fill="#4f7ec2"/>';
      s += '<path d="M165 262 q0 -8 8 -10" stroke="#2f6b2f" stroke-width="2" fill="none"/>';
    }
    s += '<rect x="150" y="272" width="30" height="16" rx="3" fill="#7a4a2b"/>';
    // Door and mat (difference 5: striped mat in A, plain in B).
    s += '<rect x="290" y="220" width="70" height="100" fill="#6a3f2a" stroke="#0f1530" stroke-width="3"/>';
    s += '<circle cx="348" cy="272" r="4" fill="#ffd97a"/>';
    s += '<rect x="275" y="322" width="100" height="14" rx="3" fill="#8a5a35"/>';
    if (!B) {
      s += '<rect x="285" y="322" width="8" height="14" fill="#e2574c"/>';
      s += '<rect x="305" y="322" width="8" height="14" fill="#e2574c"/>';
      s += '<rect x="325" y="322" width="8" height="14" fill="#e2574c"/>';
      s += '<rect x="345" y="322" width="8" height="14" fill="#e2574c"/>';
    }
    // Bicycle with a basket (difference 4: the basket is missing in B).
    s += '<circle cx="90" cy="312" r="18" fill="none" stroke="#d8d8d8" stroke-width="3"/>';
    s += '<circle cx="150" cy="312" r="18" fill="none" stroke="#d8d8d8" stroke-width="3"/>';
    s += '<path d="M90 312 L120 282 L150 312 M120 282 L132 312 M120 282 L108 268" stroke="#4fd1c5" stroke-width="3" fill="none"/>';
    if (!B) {
      s += '<rect x="128" y="288" width="22" height="16" rx="2" fill="#b5763e" stroke="#7a4a2b" stroke-width="2"/>';
    }
    // Potted plant (difference 3: red flower in A, white in B).
    s += '<path d="M536 318 h28 l-4 26 h-20 z" fill="#b04a3a"/>';
    s += '<circle cx="546" cy="308" r="8" fill="#2f6b2f"/><circle cx="556" cy="304" r="8" fill="#2f6b2f"/>';
    s += '<circle cx="550" cy="296" r="7" fill="' + (B ? '#f4ead8' : '#e2574c') + '"/>';
    return s;
  }

  /* ---------------- Level 3: The Midnight Garden ---------------- */
  function drawGarden(variant) {
    var B = variant === 'B';
    var s = sky(variant);
    s += moon(80, 60, variant);
    // Shooting star (difference 5: present in A only).
    if (!B) {
      s += '<line x1="470" y1="60" x2="510" y2="84" stroke="#f4ead8" stroke-width="2.5" stroke-linecap="round"/>';
      s += '<circle cx="512" cy="85" r="3" fill="#f4ead8"/>';
    }
    // Fireflies (difference 2: five in A, three in B).
    var flies = [[150, 120], [220, 90], [300, 130], [380, 100], [460, 140]];
    for (var f = 0; f < flies.length; f++) {
      if (B && f >= 3) continue;
      s += '<circle cx="' + flies[f][0] + '" cy="' + flies[f][1] + '" r="3.5" fill="#d8f79a"/>';
      s += '<circle cx="' + flies[f][0] + '" cy="' + flies[f][1] + '" r="8" fill="#d8f79a" opacity="0.25"/>';
    }
    // Willow tree (difference 7: one long branch in A is short in B).
    s += '<path d="M60 300 L78 200 L96 300 Z" fill="#4a3220"/>';
    s += '<path d="M78 200 Q60 240 55 290" stroke="#2f6b2f" stroke-width="3" fill="none"/>';
    s += '<path d="M78 200 Q96 235 100 285" stroke="#2f6b2f" stroke-width="3" fill="none"/>';
    s += '<path d="M78 190 Q78 240 ' + (B ? '84' : '70') + ' ' + (B ? '230' : '285') + '" stroke="#2f6b2f" stroke-width="3" fill="none"/>';
    s += '<circle cx="78" cy="185" r="26" fill="#3f7a3f" opacity="0.9"/>';
    // Fence (difference 9: one post missing in B).
    s += '<rect x="180" y="215" width="280" height="6" fill="#6a4a2a"/>';
    var posts = [190, 250, 310, 370, 430];
    for (var p = 0; p < posts.length; p++) {
      if (B && p === 2) continue;
      s += '<rect x="' + (posts[p] - 4) + '" y="195" width="8" height="34" fill="#7a5a35"/>';
    }
    // Pond, lily pads, koi and frog.
    s += '<ellipse cx="320" cy="335" rx="185" ry="48" fill="#2a4a6b"/>';
    s += '<ellipse cx="320" cy="335" rx="185" ry="48" fill="none" stroke="#4f7ec2" stroke-width="2" opacity="0.5"/>';
    // Lily pads (difference 10: three in A, two in B).
    s += '<ellipse cx="250" cy="345" rx="26" ry="9" fill="#3f7a3f"/>';
    s += '<ellipse cx="430" cy="340" rx="26" ry="9" fill="#3f7a3f"/>';
    if (!B) s += '<ellipse cx="330" cy="358" rx="24" ry="8" fill="#3f7a3f"/>';
    // Koi (difference 1: two fish in A, one in B).
    s += '<g><ellipse cx="300" cy="330" rx="14" ry="6" fill="#ff8a3c"/>';
    s += '<polygon points="314,330 324,324 324,336" fill="#ff8a3c"/></g>';
    if (!B) {
      s += '<g><ellipse cx="380" cy="348" rx="12" ry="5" fill="#ffd97a"/>';
      s += '<polygon points="368,348 358,343 358,353" fill="#ffd97a"/></g>';
    }
    // Frog on a lily pad (difference 11: present in A only).
    if (!B) {
      s += '<ellipse cx="252" cy="338" rx="9" ry="7" fill="#7ee081"/>';
      s += '<circle cx="247" cy="332" r="3.5" fill="#7ee081"/><circle cx="257" cy="332" r="3.5" fill="#7ee081"/>';
      s += '<circle cx="247" cy="331" r="1.2" fill="#141a2e"/><circle cx="257" cy="331" r="1.2" fill="#141a2e"/>';
    }
    // Bridge planks (difference 6: one plank missing in B).
    var planks = [240, 272, 304, 336, 368];
    for (var k = 0; k < planks.length; k++) {
      if (B && k === 2) continue;
      s += '<rect x="' + (planks[k] - 13) + '" y="296" width="26" height="9" rx="3" fill="#b5763e" stroke="#7a4a2b" stroke-width="1.5"/>';
    }
    s += '<path d="M225 296 Q320 282 415 296" stroke="#8a5a35" stroke-width="3" fill="none"/>';
    // Stone lantern (difference 3: lit in A, dark in B).
    s += '<rect x="510" y="300" width="26" height="18" fill="#8a8f98"/>';
    s += '<rect x="506" y="282" width="34" height="18" fill="#a8adb8"/>';
    s += '<rect x="516" y="286" width="14" height="10" fill="' + (B ? '#2a2f3f' : '#ffd97a') + '"/>';
    s += '<polygon points="500,282 542,282 523,268" fill="#6a6f7a"/>';
    // Flowers (difference 4: one flower is red in A, white in B).
    var flowers = [[120, 388], [170, 392], [220, 388], [470, 390], [520, 386], [570, 390]];
    for (var fl = 0; fl < flowers.length; fl++) {
      var fc = (fl === 2) ? (B ? '#f4ead8' : '#e2574c') : '#ff8ab0';
      s += '<circle cx="' + flowers[fl][0] + '" cy="' + flowers[fl][1] + '" r="7" fill="' + fc + '"/>';
      s += '<circle cx="' + flowers[fl][0] + '" cy="' + (flowers[fl][1] + 9) + '" r="2" fill="#2f6b2f"/>';
    }
    // Path stones (difference 8: four stones in A, three in B).
    var stones = [[180, 400], [250, 406], [320, 400], [390, 406]];
    for (var st = 0; st < stones.length; st++) {
      if (B && st === 2) continue;
      s += '<ellipse cx="' + stones[st][0] + '" cy="' + stones[st][1] + '" rx="20" ry="7" fill="#8a8f98"/>';
    }
    // Garden sign (difference 12: the arrow points left in A, right in B).
    s += '<rect x="556" y="210" width="6" height="60" fill="#6a4a2a"/>';
    s += '<rect x="520" y="185" width="76" height="26" rx="5" fill="#f4ead8" stroke="#8a5a35" stroke-width="2"/>';
    if (B) {
      s += '<polygon points="586,198 572,191 572,205" fill="#7a2a20"/>';
    } else {
      s += '<polygon points="530,198 544,191 544,205" fill="#7a2a20"/>';
    }
    s += '<text x="558" y="203" font-size="11" font-weight="bold" text-anchor="middle" fill="#5a4632">GARDEN</text>';
    return s;
  }

  window.SCENES = [
    {
      name: 'The Dumpling Stall',
      time: 180,
      draw: drawStall,
      diffs: [
        { x: 560, y: 312, r: 16, label: 'lantern tassel' },
        { x: 480, y: 278, r: 24, label: 'cat colour' },
        { x: 292, y: 170, r: 16, label: 'price on the sign' },
        { x: 370, y: 230, r: 22, label: 'awning stripe' },
        { x: 256, y: 264, r: 14, label: 'a dumpling' },
        { x: 90, y: 192, r: 24, label: 'lit window' },
        { x: 300, y: 40, r: 16, label: 'bird on the wire' }
      ]
    },
    {
      name: 'The Paper Lantern Shop',
      time: 150,
      draw: drawShop,
      diffs: [
        { x: 270, y: 148, r: 20, label: 'middle lantern colour' },
        { x: 500, y: 150, r: 16, label: 'paper crane' },
        { x: 550, y: 296, r: 16, label: 'plant flower colour' },
        { x: 139, y: 296, r: 22, label: 'bicycle basket' },
        { x: 325, y: 329, r: 22, label: 'door mat stripes' },
        { x: 378, y: 76, r: 16, label: 'shop sign word' },
        { x: 165, y: 256, r: 18, label: 'window vase' },
        { x: 200, y: 99, r: 16, label: 'roof tile colour' },
        { x: 470, y: 70, r: 20, label: 'cat on the roof' }
      ]
    },
    {
      name: 'The Midnight Garden',
      time: 120,
      draw: drawGarden,
      diffs: [
        { x: 380, y: 348, r: 22, label: 'a koi fish' },
        { x: 380, y: 100, r: 20, label: 'a firefly' },
        { x: 523, y: 291, r: 18, label: 'stone lantern light' },
        { x: 220, y: 388, r: 14, label: 'flower colour' },
        { x: 490, y: 72, r: 18, label: 'shooting star' },
        { x: 304, y: 300, r: 18, label: 'bridge plank' },
        { x: 72, y: 268, r: 16, label: 'willow branch' },
        { x: 320, y: 400, r: 16, label: 'path stone' },
        { x: 310, y: 212, r: 14, label: 'fence post' },
        { x: 330, y: 358, r: 16, label: 'lily pad' },
        { x: 252, y: 335, r: 16, label: 'frog' },
        { x: 537, y: 198, r: 16, label: 'sign arrow' }
      ]
    }
  ];
})();
