(function () {
  var ZONES = {"3": {"last": "May 15", "first": "Sep 15", "days": 123}, "4": {"last": "May 10", "first": "Sep 21", "days": 134}, "5a": {"last": "May 15", "first": "Oct 1", "days": 139}, "5b": {"last": "May 7", "first": "Oct 12", "days": 158}, "6a": {"last": "Apr 21", "first": "Oct 17", "days": 179}, "6b": {"last": "Apr 14", "first": "Oct 22", "days": 191}, "7a": {"last": "Apr 7", "first": "Oct 28", "days": 204}, "7b": {"last": "Apr 1", "first": "Nov 3", "days": 216}, "8a": {"last": "Mar 25", "first": "Nov 8", "days": 228}, "8b": {"last": "Mar 15", "first": "Nov 15", "days": 245}, "9a": {"last": "Feb 25", "first": "Dec 5", "days": 283}, "9b": {"last": "Feb 10", "first": "Dec 15", "days": 308}};
  var form = document.getElementById('zip-form');
  var input = document.getElementById('zip-input');
  var out = document.getElementById('zip-result');
  if (!form || !input || !out) return;

  function show(html) { out.innerHTML = html; out.className = 'zipresult'; }
  function showErr(html) { out.innerHTML = html; out.className = 'zipresult err'; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var zip = (input.value || '').trim();
    if (!/^[0-9]{5}$/.test(zip)) {
      showErr('<p>Enter a 5 digit US ZIP code.</p>');
      return;
    }
    show('<p>Looking up ' + zip + '...</p>');
    fetch('https://phzmapi.org/' + zip + '.json')
      .then(function (r) { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(function (d) {
        var zone = (d.zone || '').trim();
        // Same fallback as this site's own to_dataset_zone(): USDA reports
        // half zones (3a/3b/4a/4b) that this site's calendar dataset treats
        // as whole zones 3/4. Try the exact zone first, then the whole zone,
        // before saying there is no data, matching every other page here.
        var dz = ZONES[zone] ? zone : zone.replace(/[ab]$/, '');
        var z = ZONES[dz];
        if (!z) {
          showErr('<p><strong>ZIP ' + zip + ' is USDA zone ' + zone + '.</strong></p>' +
            '<p>This site has no frost date average for zone ' + zone + '. It is either too ' +
            'cold (zones 1 and 2) or it never freezes (zone 10 and warmer). ' +
            '<a href="../sources/index.html">Why some zones show no data</a>.</p>');
          return;
        }
        var zoneLine = dz === zone
          ? 'ZIP ' + zip + ' is USDA zone ' + zone + '.'
          : 'ZIP ' + zip + ' is USDA zone ' + zone + ', which this site\'s dataset ' +
            'covers as zone ' + dz + '.';
        show('<p><strong>' + zoneLine + '</strong></p>' +
          '<table class="data"><tbody>' +
          '<tr><td>Average last spring frost</td><td>' + z.last + '</td></tr>' +
          '<tr><td>Average first fall frost</td><td>' + z.first + '</td></tr>' +
          '<tr><td>Frost free growing season</td><td>' + z.days + ' days</td></tr>' +
          '</tbody></table>' +
          '<p><a class="cta" href="../zone/' + dz + '/index.html">See the full zone ' +
          dz + ' planting calendar</a></p>');
      })
      .catch(function () {
        showErr('<p>Could not find that ZIP code. Double check it and try again.</p>');
      });
  });
})();
