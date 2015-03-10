(function() {
  'use strict';
  var map = createMap(),
    layers,
    icons = {
      refuge: L.icon({
        iconUrl: '/region4/demo/img/map/blue-goose75.png',
        iconSize: [75, 40],
        popupAnchor: [7, -17]
      }),
      hatchery: L.icon({
        iconUrl: '/region4/demo/img/map/fish75.png',
        iconSize: [75, 66],
        popupAnchor: [7, -27]
      })
    };

  L.Icon.Default.imagePath = '/region4/demo/img/map';

  $.getJSON('../js/offices.geojson', function(geojson) {
    layers = addLayers(map, geojson);
    initAutocomplete(map, geojson);
  });

  // Prevent form submission from reloading the page
  $('form').submit(function(e) { e.preventDefault(); });

  function createMap() {

    var map = L.map('map', {
      center: [33.761907, -85.733524],
      zoomControl: false
    });

    new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
    return map;
  }

  function addLayers(map, offices) {

    var cluster = new L.MarkerClusterGroup({showCoverageOnHover: false});
    var markers = {
      refugeMarkers: createOfficeLayer(offices, 'National Wildlife Refuge', 'refuge').addTo(cluster),
      officeMarkers: createOfficeLayer(offices, 'Ecological Services Field Office', 'refuge').addTo(cluster),
      hatcheryMarkers: createOfficeLayer(offices, 'National Fish Hatchery', 'hatchery').addTo(cluster),
      jvMarkers: createOfficeLayer(offices, 'Joint Venture Office', 'hatchery').addTo(cluster)
    };

    var basemap = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
      attribution: '<a href="#about" class="trigger-modal">About</a>',
      subdomains: 'abcd',
      minZoom: 4,
      maxZoom: 18
    }).addTo(map);

    map.fitBounds(cluster.getBounds());
    map.addLayer(cluster);

    return {
      markers: markers,
      basemap: basemap,
      cluster: cluster
    };
  }

  function onEachOffice(feature, layer) {
    layer.bindPopup(feature.properties.ORGNAME);
  }

  function createOfficeLayer(offices, officeType, icon) {
    
    return L.geoJson(offices, {
      filter: function(feature) {
        switch(feature.properties.ORGTYPE) {
          case officeType: return true;
          default: return false;
        }
      },
      onEachFeature: onEachOffice,
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: icons[icon]});
      }
    });
  }

  function zoomToOffice(map, offices, name) {

    var office = $.grep(offices.features, function(el) {
      return el.properties.ORGNAME === name;
    });
    map.setView(office[0].geometry.coordinates.reverse(), 13);
  }

  function initAutocomplete(map, offices) {

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
  }
})();