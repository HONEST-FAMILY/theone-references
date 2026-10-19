(function () {
  function rng(seed) {
    var s = (seed * 2654435761) >>> 0 || 1;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function uri(svg) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function wrap(w, h, body, defs) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid slice">' + (defs ? "<defs>" + defs + "</defs>" : "") + body + "</svg>";
  }
  function noiseFilter(id, freq, oct, seed, rgb, a, b, type) {
    return '<filter id="' + id + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="' + (type || "fractalNoise") + '" baseFrequency="' + freq + '" numOctaves="' + oct + '" seed="' + seed + '" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 ' + rgb[0] + " 0 0 0 0 " + rgb[1] + " 0 0 0 0 " + rgb[2] + " " + a + " 0 0 0 " + b + '"/></filter>';
  }

  var TEX = {
    wood: { base: "#c08a52", f: ["0.006 0.22", 3, [0.35, 0.2, 0.08], 1.5, -0.35] },
    oak: { base: "#d2a777", f: ["0.004 0.16", 3, [0.42, 0.26, 0.12], 1.3, -0.3] },
    plywood: { base: "#dcb98a", f: ["0.012 0.06", 4, [0.5, 0.33, 0.16], 1.6, -0.55], turb: true },
    marble: { base: "#efebe5", f: ["0.006 0.018", 5, [0.38, 0.38, 0.42], 2.4, -1.25], turb: true },
    concrete: { base: "#b8b5ae", f: ["0.9", 2, [0.33, 0.33, 0.32], 1.25, -0.45] },
    gypsum: { base: "#f2f0ea", f: ["0.7", 2, [0.6, 0.6, 0.58], 0.6, -0.2] },
    insulation: { base: "#bcd2f0", f: ["0.35", 3, [0.25, 0.4, 0.7], 0.9, -0.3] },
    membrane: { base: "#3c4a45", f: ["0.02 0.4", 2, [0.7, 0.8, 0.78], 0.6, -0.25] },
    steel: { base: "#a9b0b7", f: ["0.002 0.9", 2, [0.95, 0.97, 1], 0.7, -0.2] }
  };

  function texture(type, opt) {
    opt = opt || {};
    var w = opt.w || 480, h = opt.h || 360, seed = opt.seed || 7, id = "t" + type + seed;
    if (type === "tile") return tile(w, h, seed, opt);
    if (type === "brick") return brick(w, h, seed);
    if (type === "glass") return glass(w, h, seed, opt);
    var t = TEX[type] || TEX.concrete;
    var f = t.f;
    var defs = noiseFilter(id, f[0], f[1], seed, f[2], f[3], f[4], t.turb ? "turbulence" : "fractalNoise");
    var extra = "";
    if (type === "steel") {
      defs += '<linearGradient id="g' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dfe3e8"/><stop offset=".45" stop-color="#9aa2ab"/><stop offset=".55" stop-color="#c7ccd2"/><stop offset="1" stop-color="#7f8891"/></linearGradient>';
      return wrap(w, h, '<rect width="100%" height="100%" fill="url(#g' + id + ')"/><rect width="100%" height="100%" filter="url(#' + id + ')"/>', defs);
    }
    if (type === "insulation") {
      for (var y = 60; y < h; y += 90) extra += '<line x1="0" y1="' + y + '" x2="' + w + '" y2="' + y + '" stroke="#9fb9df" stroke-width="2"/>';
    }
    if (type === "membrane") {
      defs += '<linearGradient id="g' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>';
      extra += '<rect width="100%" height="100%" fill="url(#g' + id + ')"/>';
    }
    if (type === "concrete") {
      var r = rng(seed);
      for (var i = 0; i < 26; i++) extra += '<circle cx="' + (r() * w).toFixed(1) + '" cy="' + (r() * h).toFixed(1) + '" r="' + (1 + r() * 2.6).toFixed(1) + '" fill="#8d8a84" opacity=".55"/>';
    }
    return wrap(w, h, '<rect width="100%" height="100%" fill="' + t.base + '"/><rect width="100%" height="100%" filter="url(#' + id + ')"/>' + extra, defs);
  }

  function tile(w, h, seed, opt) {
    var size = opt.size || 120, body = '<rect width="100%" height="100%" fill="#8f8a82"/>';
    var r = rng(seed);
    for (var y = 0; y < h; y += size) for (var x = 0; x < w; x += size) {
      var l = 82 + Math.round(r() * 6);
      body += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (size - 4) + '" height="' + (size - 4) + '" fill="hsl(36 10% ' + l + '%)"/>';
    }
    var id = "tt" + seed;
    return wrap(w, h, body + '<rect width="100%" height="100%" filter="url(#' + id + ')"/>', noiseFilter(id, "0.8", 2, seed, [0.4, 0.38, 0.35], 0.5, -0.18));
  }

  function brick(w, h, seed) {
    var r = rng(seed), bw = 96, bh = 34, body = '<rect width="100%" height="100%" fill="#cfc6bb"/>';
    for (var row = 0, y = 0; y < h; y += bh, row++) {
      for (var x = row % 2 ? -bw / 2 : 0; x < w; x += bw) {
        var hue = 12 + Math.round(r() * 10), l = 36 + Math.round(r() * 12);
        body += '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + (bw - 6) + '" height="' + (bh - 6) + '" rx="2" fill="hsl(' + hue + ' 48% ' + l + '%)"/>';
      }
    }
    return wrap(w, h, body);
  }

  function glass(w, h, seed, opt) {
    var frame = opt.frame || "#e9ecef", id = "gl" + seed;
    var defs = '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe3f5"/><stop offset=".5" stop-color="#9cc0e2"/><stop offset="1" stop-color="#d9ebf8"/></linearGradient>';
    var body = '<rect width="100%" height="100%" fill="#dfe6ec"/>';
    var pad = 26, mid = w / 2;
    body += '<rect x="' + pad + '" y="' + pad + '" width="' + (w - pad * 2) + '" height="' + (h - pad * 2) + '" fill="' + frame + '" stroke="#b9c2cb" stroke-width="3"/>';
    body += '<rect x="' + (pad + 14) + '" y="' + (pad + 14) + '" width="' + (mid - pad - 22) + '" height="' + (h - pad * 2 - 28) + '" fill="url(#' + id + ')"/>';
    body += '<rect x="' + (mid + 8) + '" y="' + (pad + 14) + '" width="' + (mid - pad - 22) + '" height="' + (h - pad * 2 - 28) + '" fill="url(#' + id + ')"/>';
    body += '<path d="M' + (pad + 30) + " " + (h - pad - 40) + " L" + (mid - 40) + " " + (pad + 40) + '" stroke="#fff" stroke-opacity=".55" stroke-width="10"/>';
    return wrap(w, h, body, defs);
  }

  function floorplan(seed, opt) {
    opt = opt || {};
    var w = opt.w || 480, h = opt.h || 320, stroke = opt.stroke || "#1d2a6b", bg = opt.bg || "#f6f7fb", accent = opt.accent || "#ff6b1a";
    var r = rng(seed), m = 34, rooms = [{ x: m, y: m, w: w - m * 2, h: h - m * 2 }];
    var labels = ["거실", "침실", "주방", "욕실", "현관", "드레스룸", "서재", "다용도"];
    for (var k = 0; k < 4; k++) {
      rooms.sort(function (a, b) { return b.w * b.h - a.w * a.h; });
      var big = rooms.shift(), vertical = big.w > big.h, t = 0.35 + r() * 0.3;
      if (vertical) {
        var cw = Math.round(big.w * t);
        rooms.push({ x: big.x, y: big.y, w: cw, h: big.h }, { x: big.x + cw, y: big.y, w: big.w - cw, h: big.h });
      } else {
        var ch = Math.round(big.h * t);
        rooms.push({ x: big.x, y: big.y, w: big.w, h: ch }, { x: big.x, y: big.y + ch, w: big.w, h: big.h - ch });
      }
    }
    var body = '<rect width="100%" height="100%" fill="' + bg + '"/>';
    for (var gx = 0; gx < w; gx += 20) body += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + h + '" stroke="' + stroke + '" stroke-opacity=".06"/>';
    for (var gy = 0; gy < h; gy += 20) body += '<line x1="0" y1="' + gy + '" x2="' + w + '" y2="' + gy + '" stroke="' + stroke + '" stroke-opacity=".06"/>';
    rooms.forEach(function (rm, i) {
      body += '<rect x="' + rm.x + '" y="' + rm.y + '" width="' + rm.w + '" height="' + rm.h + '" fill="none" stroke="' + stroke + '" stroke-width="3"/>';
      var dx = rm.x + 10, dy = rm.y + rm.h;
      body += '<path d="M' + dx + " " + dy + " a26 26 0 0 1 26 -26" + '" fill="none" stroke="' + stroke + '" stroke-opacity=".5" stroke-width="1.5"/>';
      body += '<text x="' + (rm.x + rm.w / 2) + '" y="' + (rm.y + rm.h / 2 + 5) + '" text-anchor="middle" font-family="sans-serif" font-size="13" fill="' + stroke + '" fill-opacity=".75">' + labels[i % labels.length] + "</text>";
    });
    body += '<rect x="' + m + '" y="' + m + '" width="' + (w - m * 2) + '" height="' + (h - m * 2) + '" fill="none" stroke="' + stroke + '" stroke-width="6"/>';
    body += '<line x1="' + m + '" y1="16" x2="' + (w - m) + '" y2="16" stroke="' + accent + '" stroke-width="1.5"/><line x1="' + m + '" y1="10" x2="' + m + '" y2="22" stroke="' + accent + '"/><line x1="' + (w - m) + '" y1="10" x2="' + (w - m) + '" y2="22" stroke="' + accent + '"/>';
    body += '<text x="' + w / 2 + '" y="12" text-anchor="middle" font-family="sans-serif" font-size="10" fill="' + accent + '">' + (9000 + Math.round(r() * 6) * 600).toLocaleString("en-US") + "</text>";
    return wrap(w, h, body);
  }

  function facade(seed, opt) {
    opt = opt || {};
    var w = opt.w || 480, h = opt.h || 320, mode = opt.mode || "flat";
    var stroke = opt.stroke || "#1d2a6b", sky = opt.sky || "#eef2fb", wall = opt.wall || "#ffffff", roofC = opt.roof || "#2337d9", glassC = opt.glass || "#b9c9f5", accent = opt.accent || "#ff6b1a";
    var r = rng(seed), line = mode === "line";
    var floors = 1 + Math.floor(r() * 3), bw = Math.round(w * (0.5 + r() * 0.25)), fh = Math.round((h * 0.52) / floors);
    var bx = Math.round((w - bw) / 2), ground = h - 38, top = ground - fh * floors, roofType = Math.floor(r() * 3);
    var body = '<rect width="100%" height="100%" fill="' + (line ? opt.bg || "#0d1640" : sky) + '"/>';
    if (line) for (var gx = 0; gx < w; gx += 24) body += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + h + '" stroke="' + stroke + '" stroke-opacity=".12"/>';
    var fillWall = line ? "none" : wall, fillRoof = line ? "none" : roofC, fillGlass = line ? "none" : glassC;
    body += '<rect x="' + bx + '" y="' + top + '" width="' + bw + '" height="' + (ground - top) + '" fill="' + fillWall + '" stroke="' + stroke + '" stroke-width="2.5"/>';
    if (roofType === 0) body += '<polygon points="' + (bx - 14) + "," + top + " " + (bx + bw / 2) + "," + (top - fh * 0.75) + " " + (bx + bw + 14) + "," + top + '" fill="' + fillRoof + '" stroke="' + stroke + '" stroke-width="2.5"/>';
    else if (roofType === 1) body += '<polygon points="' + (bx - 10) + "," + top + " " + (bx - 10) + "," + (top - fh * 0.35) + " " + (bx + bw + 10) + "," + (top - fh * 0.7) + " " + (bx + bw + 10) + "," + top + '" fill="' + fillRoof + '" stroke="' + stroke + '" stroke-width="2.5"/>';
    else body += '<rect x="' + (bx - 6) + '" y="' + (top - 12) + '" width="' + (bw + 12) + '" height="12" fill="' + fillRoof + '" stroke="' + stroke + '" stroke-width="2.5"/>';
    for (var f = 0; f < floors; f++) {
      var n = 2 + Math.floor(r() * 3), gap = bw / n, wy = top + f * fh + fh * 0.22, ww = gap * 0.56, wh = fh * 0.48;
      for (var i = 0; i < n; i++) {
        var wx = bx + gap * i + (gap - ww) / 2;
        if (f === floors - 1 && i === Math.floor(n / 2)) continue;
        body += '<rect x="' + wx.toFixed(1) + '" y="' + wy.toFixed(1) + '" width="' + ww.toFixed(1) + '" height="' + wh.toFixed(1) + '" fill="' + fillGlass + '" stroke="' + stroke + '" stroke-width="2"/>';
        body += '<line x1="' + (wx + ww / 2).toFixed(1) + '" y1="' + wy.toFixed(1) + '" x2="' + (wx + ww / 2).toFixed(1) + '" y2="' + (wy + wh).toFixed(1) + '" stroke="' + stroke + '" stroke-width="1.2"/>';
      }
      if (f > 0) body += '<line x1="' + bx + '" y1="' + (top + f * fh) + '" x2="' + (bx + bw) + '" y2="' + (top + f * fh) + '" stroke="' + stroke + '" stroke-opacity=".5"/>';
    }
    var dw = Math.max(34, bw * 0.12), dx = bx + bw / 2 - dw / 2;
    body += '<rect x="' + dx.toFixed(1) + '" y="' + (ground - fh * 0.62).toFixed(1) + '" width="' + dw.toFixed(1) + '" height="' + (fh * 0.62).toFixed(1) + '" fill="' + (line ? "none" : accent) + '" stroke="' + stroke + '" stroke-width="2"/>';
    body += '<line x1="0" y1="' + ground + '" x2="' + w + '" y2="' + ground + '" stroke="' + stroke + '" stroke-width="2.5"/>';
    for (var tr = 0; tr < 2; tr++) {
      var tx = tr ? bx + bw + 30 + r() * 20 : bx - 34 - r() * 20, tsz = 16 + r() * 10;
      body += '<line x1="' + tx.toFixed(1) + '" y1="' + ground + '" x2="' + tx.toFixed(1) + '" y2="' + (ground - tsz * 1.6).toFixed(1) + '" stroke="' + stroke + '" stroke-width="2"/><circle cx="' + tx.toFixed(1) + '" cy="' + (ground - tsz * 1.9).toFixed(1) + '" r="' + tsz.toFixed(1) + '" fill="' + (line ? "none" : "#9fc79a") + '" stroke="' + stroke + '" stroke-width="2"/>';
    }
    return wrap(w, h, body);
  }

  function room(seed, opt) {
    opt = opt || {};
    var w = opt.w || 480, h = opt.h || 320, r = rng(seed);
    var floorC = opt.floor || ["#c9a272", "#d8c1a0", "#a9a39a"][Math.floor(r() * 3)], wallC = opt.wall || ["#f3efe8", "#e9edf2", "#f1ece4"][Math.floor(r() * 3)], stroke = opt.stroke || "#2b2f3a";
    var x0 = w * 0.28, x1 = w * 0.72, y0 = h * 0.2, y1 = h * 0.66;
    var body = '<rect width="100%" height="100%" fill="' + wallC + '"/>';
    body += '<polygon points="0,' + h + " " + w + "," + h + " " + x1 + "," + y1 + " " + x0 + "," + y1 + '" fill="' + floorC + '"/>';
    for (var i = 1; i < 6; i++) {
      var t = i / 6, xa = x0 + (x1 - x0) * t, xb = w * t;
      body += '<line x1="' + xa.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + xb.toFixed(1) + '" y2="' + h + '" stroke="#000" stroke-opacity=".08"/>';
    }
    body += '<polygon points="0,0 ' + x0 + "," + y0 + " " + x0 + "," + y1 + " 0," + h + '" fill="#000" fill-opacity=".04"/>';
    body += '<polygon points="' + w + ",0 " + x1 + "," + y0 + " " + x1 + "," + y1 + " " + w + "," + h + '" fill="#000" fill-opacity=".07"/>';
    body += '<rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '" fill="' + wallC + '" stroke="#000" stroke-opacity=".08"/>';
    var wx = x0 + (x1 - x0) * (0.12 + r() * 0.4), wwid = (x1 - x0) * 0.38;
    body += '<rect x="' + wx.toFixed(1) + '" y="' + (y0 + 18) + '" width="' + wwid.toFixed(1) + '" height="' + ((y1 - y0) * 0.5).toFixed(1) + '" fill="#cfe2f3" stroke="#fff" stroke-width="5"/>';
    var sx = w * 0.3, sy = h * 0.7;
    body += '<rect x="' + sx + '" y="' + sy + '" width="' + w * 0.4 + '" height="' + h * 0.1 + '" rx="10" fill="' + (opt.sofa || ["#2337d9", "#3d4a5c", "#b9693a"][Math.floor(r() * 3)]) + '"/>';
    body += '<rect x="' + (sx - 6) + '" y="' + (sy - 16) + '" width="' + (w * 0.4 + 12) + '" height="22" rx="10" fill="#000" fill-opacity=".18"/>';
    body += '<line x1="' + w * 0.82 + '" y1="' + h * 0.82 + '" x2="' + w * 0.82 + '" y2="' + h * 0.42 + '" stroke="' + stroke + '" stroke-width="3"/><circle cx="' + w * 0.82 + '" cy="' + h * 0.4 + '" r="16" fill="#ffd9a8"/>';
    body += '<ellipse cx="' + w / 2 + '" cy="' + h * 0.9 + '" rx="' + w * 0.26 + '" ry="' + h * 0.05 + '" fill="#fff" fill-opacity=".35"/>';
    return wrap(w, h, body);
  }

  function forItem(type, seed, opt) {
    if (type === "plan") return floorplan(seed, opt);
    if (type === "room") return room(seed, opt);
    return facade(seed, opt);
  }

  window.BGArt = { rng: rng, uri: uri, texture: texture, floorplan: floorplan, facade: facade, room: room, forItem: forItem };
})();
