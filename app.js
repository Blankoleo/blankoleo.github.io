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
