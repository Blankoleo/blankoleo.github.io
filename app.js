// Teilen-Knopf: System-Teilen (iPhone) oder Link kopieren mit kurzer Meldung.
// Ohne JavaScript bleibt der Knopf versteckt – die Links funktionieren trotzdem.
(function () {
  var btn = document.getElementById('share');
  var toast = document.getElementById('toast');
  var url = 'https://blankoleo.github.io/';
  var timer;

  function show(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  function copy() {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(url).catch(oldCopy);
    }
    return oldCopy();
  }

  function oldCopy() {
    return new Promise(function (ok, fail) {
      var t = document.createElement('textarea');
      t.value = url; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy') ? ok() : fail(); } catch (e) { fail(e); }
      t.remove();
    });
  }

  btn.hidden = false;
  btn.addEventListener('click', function () {
    if (navigator.share) {
      navigator.share({ title: 'Blankoleo – kleine Apps', text: 'Kleine Apps von Blankoleo', url: url })
        .catch(function () {});
      return;
    }
    copy().then(function () { show('Link kopiert'); }, function () { show('Link: ' + url); });
  });
})();

// Immer die neueste Fassung zeigen: GitHub Pages lässt Browser die Seite bis zu 10 Min.
// zwischenspeichern. Darum kurz im Hintergrund nachsehen, ob es eine neuere Version gibt,
// und dann einmal frisch laden. (Bei Änderungen „seiten-version“ und ?v= in index.html erhöhen.)
(function () {
  var meta = document.querySelector('meta[name="seiten-version"]');
  var mine = meta ? meta.content : '';
  if (/[?&](v|neu)\b/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash);
  if (!window.fetch || !mine) return;
  fetch(location.pathname + '?frisch=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.text() : ''; })
    .then(function (html) {
      var m = /name="seiten-version" content="([^"]+)"/.exec(html);
      if (!m || m[1] === mine) return;
      try { if (sessionStorage.getItem('neu-geladen') === m[1]) return; sessionStorage.setItem('neu-geladen', m[1]); } catch (e) {}
      location.replace(location.pathname + '?v=' + encodeURIComponent(m[1]) + location.hash);
    })
    .catch(function () {});
})();
