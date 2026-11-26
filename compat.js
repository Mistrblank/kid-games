/* Compatibility helpers so the games run on older iPads (iOS 12 and up).
   Written in old-style JavaScript on purpose so this file itself never breaks. */
(function () {
  // 0. If something breaks, show the error on the page so it can be reported without a computer.
  var shown = 0;
  window.addEventListener('error', function (e) {
    if (shown++ > 2) return;
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;background:#b00020;color:#fff;' +
      'font:14px/1.4 -apple-system,sans-serif;padding:10px 12px;border-radius:10px;white-space:pre-wrap;word-break:break-word';
    box.textContent = 'Oops, the game hit an error (please send a screenshot):\n' +
      (e.message || 'unknown') + '\nline ' + (e.lineno || '?') + ', column ' + (e.colno || '?') +
      (e.filename ? ' in ' + e.filename.split('/').slice(-2).join('/') : '') +
      '\n' + navigator.userAgent;
    var add = function () { document.body.appendChild(box); };
    if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  });

  // 1. Rounded rectangles on canvas (Safari 16+). Used by Gem Cave.
  if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (typeof r !== 'number') r = (r && r[0]) || 0;
      r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
    };
  }

  // 2. ResizeObserver (Safari 13.1+). Used by Space Escape. Falls back to window resize events.
  if (!window.ResizeObserver) {
    window.ResizeObserver = function (cb) { this.cb = cb; };
    window.ResizeObserver.prototype.observe = function (el) {
      var self = this;
      var fire = function () { self.cb([{ target: el, contentRect: el.getBoundingClientRect() }], self); };
      window.addEventListener('resize', fire);
      window.addEventListener('orientationchange', function () { setTimeout(fire, 300); });
      setTimeout(fire, 0);
    };
    window.ResizeObserver.prototype.unobserve = function () {};
    window.ResizeObserver.prototype.disconnect = function () {};
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function supports(prop, val) {
    return window.CSS && CSS.supports && CSS.supports(prop, val);
  }

  // 3. Square boxes (aspect-ratio is Safari 15+). Mark an element with data-square.
  if (!supports('aspect-ratio', '1')) {
    var squareUp = function () {
      var els = document.querySelectorAll('[data-square]');
      for (var i = 0; i < els.length; i++) els[i].style.height = els[i].offsetWidth + 'px';
    };
    onReady(function () {
      squareUp();
      window.addEventListener('resize', squareUp);
      window.addEventListener('orientationchange', function () { setTimeout(squareUp, 300); });
      new MutationObserver(squareUp).observe(document.body, { childList: true, subtree: true });
    });
  }

  // 4. Spacing between items in flex rows (flex "gap" is Safari 14.1+).
  //    Old Safari understands gap for grids but ignores it for flex, so add margins instead.
  onReady(function () {
    var probe = document.createElement('div');
    probe.style.cssText = 'display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden';
    probe.appendChild(document.createElement('div'));
    probe.appendChild(document.createElement('div'));
    document.body.appendChild(probe);
    var flexGapWorks = probe.scrollHeight === 1;
    document.body.removeChild(probe);
    if (flexGapWorks) return;

    var busy = false;
    var fix = function () {
      if (busy) return;
      busy = true;
      var all = document.body.getElementsByTagName('*');
      for (var i = 0; i < all.length; i++) {
        var el = all[i], cs = getComputedStyle(el);
        if (cs.display !== 'flex' && cs.display !== 'inline-flex') continue;
        var rg = parseFloat(cs.rowGap) || 0, cg = parseFloat(cs.columnGap) || 0;
        if (!rg && !cg) continue;
        var column = cs.flexDirection.indexOf('column') === 0;
        var kids = el.children;
        for (var k = 0; k < kids.length; k++) {
          var last = k === kids.length - 1;
          if (column) { kids[k].style.marginBottom = last ? '' : rg + 'px'; }
          else {
            kids[k].style.marginRight = last ? '' : cg + 'px';
            if (cs.flexWrap !== 'nowrap') kids[k].style.marginBottom = rg + 'px';
          }
        }
      }
      busy = false;
    };
    fix();
    var t = null;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(fix, 50); })
      .observe(document.body, { childList: true, subtree: true });
  });
})();
