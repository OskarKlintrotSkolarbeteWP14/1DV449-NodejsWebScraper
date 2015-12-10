let TwoDigits = function(number){
  return (
    ('0' + number.toString()).slice(-2).toString()
  );
};

const Categories = {
  0: 'Vägtrafik',
  1: 'Kollektivtrafik',
  2: 'Planerad störning',
  3: 'Övrigt'
};

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
  Map: null,

  Initialise(settings){
    let lat = settings.lat || LeafletSettings.lat;
    let lng = settings.lng || LeafletSettings.lng;
    let geolocation = settings.geolocation || false;

    function onLocationFound(e) {
      let radius = e.accuracy / 2;
      L.marker(e.latlng).addTo(LeafletMap.Map) // Can't use "this" here
          .bindPopup("Du är inom en " + parseInt(radius) + " meters radie från denna punkt").openPopup();
      // L.circle(e.latlng, radius).addTo(map);
    }
    function onLocationError(e) {
        throw new Error("geolocationError"); //TODO: Does this crash the app?
    }

    const position = [lat, lng];
    this.Map = L.map('app').setView(position, 4);

    L.tileLayer(LeafletSettings.url, {
      attribution: LeafletSettings.attribution,
      maxZoom: LeafletSettings.maxZoom,
      id: LeafletSettings.id,
      accessToken: LeafletSettings.accessToken
    }).addTo(this.Map);

    if (geolocation){
      this.Map.locate({setView: true, maxZoom: 16});

      this.Map.on('locationfound', onLocationFound);
      this.Map.on('locationerror', onLocationError);
    }
  },

  AddMarker(message){
    let category = message.category || null;
    let createddate = message.createddate ? new Date(JSON.parse(parseInt(message.createddate.slice(6, 19)) + parseInt(message.createddate.slice(20, 22))*3600000)) : null;
    let description = message.description || null;
    let exactlocation = message.exactlocation || null;
    let id = message.id || null;
    let latitude = message.latitude || null;
    let longitude = message.longitude || null;
    let priority = message.priority || null;
    let subcategory = message.subcategory || null;
    let title = message.title || null;

    let position = [latitude, longitude];

    let marker = L.marker(position);
    let popup = L.popup()
      .setLatLng(position)
      .setContent(
        '<p><strong>' + title + '</strong>: <em>' + exactlocation + '</em></p><p>' + description + '</p><p><em>' + Categories[+category] + ': ' + subcategory + '</em><br />' + createddate.getFullYear() + '-' + TwoDigits(parseInt(createddate.getMonth()) + 1) + '-' + TwoDigits(createddate.getDate()) + ' ' + TwoDigits(createddate.getHours()) + ':' + TwoDigits(createddate.getMinutes()) + '</p>'
      )
      .openOn(this.Map);

    marker.bindPopup(popup)
      .addTo(this.Map);
  }
};

export default LeafletMap;
