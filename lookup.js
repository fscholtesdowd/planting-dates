// Row filter for the crop lookup. Every row is already in the HTML, so with
// JavaScript off the page still answers the question - it just shows all rows.
(function () {
  var crop = document.getElementById('crop');
  var zone = document.getElementById('zone');
  var grid = document.getElementById('grid');
  var count = document.getElementById('count');
  if (!crop || !zone || !grid) return;
  var rows = Array.prototype.slice.call(grid.tBodies[0].rows);

  function apply() {
    var c = crop.value, z = zone.value, shown = 0;
    rows.forEach(function (r) {
      var ok = (!c || r.dataset.crop === c) && (!z || r.dataset.zone === z);
      r.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown + (shown === 1 ? ' row' : ' rows') +
      (c || z ? ' shown' : ' (everything)');
    var p = new URLSearchParams();
    if (c) p.set('crop', c);
    if (z) p.set('zone', z);
    history.replaceState(null, '', p.toString() ? '?' + p : location.pathname);
  }

  var q = new URLSearchParams(location.search);
  if (q.get('crop')) crop.value = q.get('crop');
  if (q.get('zone')) zone.value = q.get('zone');
  crop.addEventListener('change', apply);
  zone.addEventListener('change', apply);
  apply();
})();
