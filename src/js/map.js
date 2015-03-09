(function() {
  'use strict';
  var offices = {{ site.data.offices | jsonify }};
  var map = createMap();
  addLayers(map);

  $('.modal').easyModal();

  $('.trigger-modal').on('click', function() {
    $('.modal').trigger('openModal');
  });

  $.each(offices.features, function() {
    this.value = this.properties.ORGNAME;
  });

  $('#autocomplete-search').autocomplete({
    source: offices.features,
    minLength: 3,
    position: { my : "right top", at: "right bottom" },
    select: function( event, ui ) {
      window.location.hash = ui.item.label.toLowerCase().replace(/\s+/g, '');
    }
  });

})();

function createMap() {
  'use strict';

  var map = L.map('map', {
    center: [33.761907, -85.733524],
    zoom: 5,
    zoomControl: false
  });

  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);

  return map;
}

function addLayers(map) {
  'use strict';

  L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
    attribution: '<a href="#about" class="trigger-modal">About</a>',
    subdomains: 'abcd',
    minZoom: 4,
    maxZoom: 18
  }).addTo(map);
}