let TwoDigits = function(number){
  return (
    ('0' + number.toString()).slice(-2).toString()
  );
};

const Categories = {
  '0': 'Vägtrafik',
  '1': 'Kollektivtrafik',
  '2': 'Planerad störning',
  '3': 'Övrigt'
};

let layerGroups = {
  road: new L.LayerGroup(),
  shared: new L.LayerGroup(),
  planed: new L.LayerGroup(),
  misc: new L.LayerGroup()
};

const CreateGeoJSONObject = function(message){
  let latitude = message.latitude || null;
  let longitude = message.longitude || null;
  let position = [latitude, longitude];
  let marker = L.marker(position);
  let geoJSON = marker.toGeoJSON();

  geoJSON.properties.category = parseInt(message.category.toString() || null);
  geoJSON.properties.createddate = message.createddate ? new Date(JSON.parse(parseInt(message.createddate.slice(6, 19)) + parseInt(message.createddate.slice(20, 22))*3600000)) : null;
  geoJSON.properties.description = message.description || null;
  geoJSON.properties.exactlocation = message.exactlocation || null;
  geoJSON.properties.id = message.id || null;
  geoJSON.properties.latitude = latitude;
  geoJSON.properties.longitude = longitude;
  geoJSON.properties.position = position;
  geoJSON.properties.priority = message.priority || null;
  geoJSON.properties.subcategory = message.subcategory || null;
  geoJSON.properties.title = message.title || null;

  return geoJSON;
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
    this.Map = L.map('app', {
      layers: [layerGroups.road, layerGroups.shared, layerGroups.planed, layerGroups.misc]
    }).setView(position, 4);

    let overlays = {
      [Categories['0']]: layerGroups.road,
      [Categories['1']]: layerGroups.shared,
      [Categories['2']]: layerGroups.planed,
      [Categories['3']]: layerGroups.misc
    };

    L.control.layers(null, overlays).addTo(this.Map);

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

  GetGeoJSON(messages){
    let geoJSON = [];
    for (let message in messages) {
      let temp = {};
      for (let property in messages[message]) {
        temp[property] = messages[message][property];
      }
      geoJSON.push(CreateGeoJSONObject(temp));
    }
    return geoJSON;
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
      );

    // marker.bindPopup(popup)
    //   .addTo(this.Map);

    switch (message.category) {
      case 0:
        marker.bindPopup(popup).addTo(layerGroups.road);
        break;
      case 1:
        marker.bindPopup(popup).addTo(layerGroups.shared);
        break;
      case 2:
        marker.bindPopup(popup).addTo(layerGroups.planed);
        break;
      case 3:
        marker.bindPopup(popup).addTo(layerGroups.misc);
        break;
      default:
    }

    let temp = marker.toGeoJSON();
    temp.properties.id = 1;
    return temp;
  },

  AddGeoJSONMarkers(data){
    function onEachFeature(feature, layer) {
      let title = feature.properties.tile ? '' : '<p><strong>' + feature.properties.title + '' ;
      let exactlocation = feature.properties.exactlocation ? ':</strong> <em>' + feature.properties.exactlocation + '</em></p><p>' : '</strong></p><p>';
      let description = feature.properties.description ? feature.properties.description + '</p>' : '';
      let category = feature.properties.category.toString() ? '<p><em>' + Categories[+feature.properties.category] : '';
      let subcategory = feature.properties.subcategory ? ': ' + feature.properties.subcategory + '</em><br />' : '</em><br />';
      let createddate = feature.properties.createddate.toString() ? feature.properties.createddate.getFullYear() + '-' + TwoDigits(parseInt(feature.properties.createddate.getMonth()) + 1) + '-' + TwoDigits(feature.properties.createddate.getDate()) + ' ' + TwoDigits(feature.properties.createddate.getHours()) + ':' + TwoDigits(feature.properties.createddate.getMinutes()) + '</p>' : '</p>';

      let popupContent = (
        title + exactlocation + description + category + subcategory + createddate
      );

			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}

			layer.bindPopup(popupContent);
		}

    L.geoJson(data, {

			style: function (feature) {
				return feature.properties && feature.properties.style;
			},

			onEachFeature: onEachFeature,

			pointToLayer: function (feature, latlng) {
				return L.marker(latlng);
			}
		}).addTo(this.Map);
    console.log(data);
  },

  AddPanel(){
    let overLayers = [
    	{
    		name: "Bar",
    		layer: L.geoJson(null, {pointToLayer: layerGroups.road })
    	},
    	{
    		name: "Drinking Water",
    		layer: L.geoJson(null, {pointToLayer: null })
    	},
    	{
    		name: "Fuel",
    		layer: L.geoJson(null, {pointToLayer: null })
    	},
    	{
    		name: "Parking",
    		layer: L.geoJson(null, {pointToLayer: null })
    	}
    ];

    let panelLayers = new L.Control.PanelLayers(null, overLayers, {collapsed: false});
  }
};

export default LeafletMap;
