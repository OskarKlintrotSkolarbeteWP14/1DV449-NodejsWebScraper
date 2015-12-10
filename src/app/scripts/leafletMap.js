export let LeafletSettings = {
  url: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  accessToken: 'pk.eyJ1IjoiY3VyaXVtIiwiYSI6ImNpaHp5dGEwbjA0cGR1c2tvOTY4ZG15YnUifQ.Im-J6IEzjtK1-odgOSuNMw',
  id: 'mapbox.streets',
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  lat: 63,
  lng: 15,
  zoom: 13
};

const LeafletMap = {
  Initialise(settings){
    let lat = settings.lat || LeafletSettings.lat;
    let lng = settings.lng || LeafletSettings.lng;
    let geolocation = settings.geolocation || false;

    function onLocationFound(e) {
      let radius = e.accuracy / 2;
      L.marker(e.latlng).addTo(map)
          .bindPopup("Du är inom en " + parseInt(radius) + " meters radie från denna punkt").openPopup();
      // L.circle(e.latlng, radius).addTo(map);
    }
    function onLocationError(e) {
        throw new Error("geolocationError"); //TODO: Does this crash the app?
    }

    console.log(LeafletSettings.lat);

    const position = [lat, lng];

    let map = L.map('app').setView(position, 4);
    L.tileLayer(LeafletSettings.url, {
      attribution: LeafletSettings.attribution,
      maxZoom: LeafletSettings.maxZoom,
      id: LeafletSettings.id,
      accessToken: LeafletSettings.accessToken
    }).addTo(map);
    if (geolocation){
      map.locate({setView: true, maxZoom: 16});

      map.on('locationfound', onLocationFound);
      map.on('locationerror', onLocationError);
    }
  }
};

export default LeafletMap;
