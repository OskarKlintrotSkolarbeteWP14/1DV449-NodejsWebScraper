import { TwoDigits, JsonDateToDate, FormatDate } from './helper'
import { Categories } from './viewModel'

let layerGroups = {
  road: new L.LayerGroup(),
  shared: new L.LayerGroup(),
  planed: new L.LayerGroup(),
  misc: new L.LayerGroup()
}

const CreateGeoJSONObject = (message) => {
  let latitude = message.latitude || null
  let longitude = message.longitude || null
  let position = [latitude, longitude]
  let marker = L.marker(position)
  let geoJSON = marker.toGeoJSON()

  geoJSON.properties.category = parseInt(message.category.toString() || null)
  geoJSON.properties.createddate = message.createddate ? JsonDateToDate(message.createddate) : null
  geoJSON.properties.description = message.description || null
  geoJSON.properties.exactlocation = message.exactlocation || null
  geoJSON.properties.id = message.id || null
  geoJSON.properties.latitude = latitude
  geoJSON.properties.longitude = longitude
  geoJSON.properties.position = position
  geoJSON.properties.priority = message.priority || null
  geoJSON.properties.subcategory = message.subcategory || null
  geoJSON.properties.title = message.title || null

  geoJSON.id = geoJSON.properties.id // For MarkerMap

  return geoJSON
}

export let LeafletSettings = {
  url: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  accessToken: 'pk.eyJ1IjoiY3VyaXVtIiwiYSI6ImNpaHp5dGEwbjA0cGR1c2tvOTY4ZG15YnUifQ.Im-J6IEzjtK1-odgOSuNMw',
  id: 'mapbox.streets',
  attribution: 'Map data &copy <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 16,
  lat: 63,
  lng: 15,
  zoom: 13
}

const LeafletMap = {
  Map: null,

  Initialise(settings){
    let lat = settings.lat || LeafletSettings.lat
    let lng = settings.lng || LeafletSettings.lng
    let geolocation = settings.geolocation || false

    function onLocationFound(e) {
      let radius = e.accuracy / 2
      L.marker(e.latlng).addTo(LeafletMap.Map) // Can't use "this" here
          .bindPopup("Du är inom en " + parseInt(radius) + " meters radie från denna punkt").openPopup()
      // L.circle(e.latlng, radius).addTo(map)
    }
    function onLocationError(e) {
        throw new Error("geolocationError") //TODO: Does this crash the app?
    }

    const position = [lat, lng]

    $('#map').css("height", "100%"); // To make the map height 100 %
    this.Map = L.map('map', {
      layers: [layerGroups.road, layerGroups.shared, layerGroups.planed, layerGroups.misc]
    }).setView(position, 4)

    let overlays = {
      [Categories['0']]: layerGroups.road,
      [Categories['1']]: layerGroups.shared,
      [Categories['2']]: layerGroups.planed,
      [Categories['3']]: layerGroups.misc
    }

    L.control.layers(null, overlays).addTo(this.Map)

    L.tileLayer(LeafletSettings.url, {
      attribution: LeafletSettings.attribution,
      maxZoom: LeafletSettings.maxZoom,
      id: LeafletSettings.id,
      accessToken: LeafletSettings.accessToken
    }).addTo(this.Map)

    if (geolocation){
      this.Map.locate({setView: true, maxZoom: LeafletSettings.maxZoom})

      this.Map.on('locationfound', onLocationFound)
      this.Map.on('locationerror', onLocationError)
    }
  },

  GetGeoJSON(messages){
    let geoJSON = []
    for (let message in messages) {
      let temp = {}
      for (let property in messages[message]) {
        temp[property] = messages[message][property]
      }
      geoJSON.push(CreateGeoJSONObject(temp))
    }
    return geoJSON
  },

  AddGeoJSONMarkers(data){
    let markerMap = {}

    const onEachFeature = (feature, layer) => {
      let title = feature.properties.tile ? '' : '<p><strong>' + feature.properties.title + ''
      let exactlocation = feature.properties.exactlocation ? ':</strong> <em>' + feature.properties.exactlocation + '</em></p><p>' : '</strong></p><p>'
      let description = feature.properties.description ? feature.properties.description + '</p>' : ''
      let category = feature.properties.category.toString() ? '<p><em>' + Categories[+feature.properties.category] : ''
      let subcategory = feature.properties.subcategory ? ': ' + feature.properties.subcategory + '</em><br />' : '</em><br />'
      let createddate = feature.properties.createddate.toString() ? FormatDate(feature.properties.createddate) + '</p>' : '</p>'

      let popupContent = (
        title + exactlocation + description + category + subcategory + createddate
      )

			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent
			}

      let popup = L.popup().setContent(popupContent)
			layer.bindPopup(popup)
		}
    const pointToLayer = (feature, latlng) => {
      let marker = new L.marker(latlng)
      markerMap[feature.id] = marker
      return marker
    }
    let gj = { '0': [], '1': [], '2': [], '3': [] }

    for (let item in Categories) {
      const filter = (feature, latlng) => {
        return feature.properties.category === parseInt(item)
      }
      gj[parseInt(item)]= L.geoJson(data, {
  			onEachFeature: onEachFeature,
  			pointToLayer: pointToLayer,
        filter: filter
  		})
    }

    gj['0'].addTo(layerGroups.road)
    gj['1'].addTo(layerGroups.shared)
    gj['2'].addTo(layerGroups.planed)
    gj['3'].addTo(layerGroups.misc)

    return markerMap
  }
}

export default LeafletMap
