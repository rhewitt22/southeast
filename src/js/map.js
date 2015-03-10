function createMap() {
  'use strict';

  var map = L.map('map', {
    center: [33.761907, -85.733524],
    zoomControl: false
  });

  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
  return map;
}

function addLayers(map, offices) {
  'use strict';

  var markers = new L.MarkerClusterGroup({showCoverageOnHover: false});
  var layer = L.geoJson(offices, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.ORGNAME);
    }
  }).addTo(markers);

  map.fitBounds(layer.getBounds());

  L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
    attribution: '<a href="#about" class="trigger-modal">About</a>',
    subdomains: 'abcd',
    minZoom: 4,
    maxZoom: 18
  }).addTo(map);

  map.addLayer(markers);
}

function zoomToOffice(map, offices, name) {
  'use strict';

  var office = $.grep(offices.features, function(el) {
    return el.properties.ORGNAME === name;
  });
  map.setView(office[0].geometry.coordinates.reverse(), 13);
}

(function() {
  'use strict';
  
  var map = createMap();
  var offices;
  var $modal = $('.modal');

  L.Icon.Default.imagePath = '/region4/demo/img';
  addLayers(map, offices);

  $modal.easyModal();

  $('.trigger-modal').on('click', function() {
    $modal.trigger('openModal');
  });

  $.each(offices.features, function() {
    this.value = this.properties.ORGNAME;
  });

  $('#autocomplete-search').autocomplete({
    source: offices.features,
    minLength: 3,
    position: { my : 'right top', at: 'right bottom' },
    select: function( event, ui ) {
      zoomToOffice(map, offices, ui.item.label);
    }
  });

  $('form').submit(function(e) { e.preventDefault(); });
})();

