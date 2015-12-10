import React from 'react';
import MyMap from './myMap';

const styles = {

};

const MapBox = {
  url: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  accessToken: 'pk.eyJ1IjoiY3VyaXVtIiwiYSI6ImNpaHp5dGEwbjA0cGR1c2tvOTY4ZG15YnUifQ.Im-J6IEzjtK1-odgOSuNMw',
  id: 'mapbox.streets',
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18
};

const FullscreenMap = React.createClass({
  propTypes: {
    // add: React.PropTypes.number
  },

  getInitialState(){
    return {
      lat: 63,
      lng: 15,
      zoom: 13
    };
  },

  getDefaultProps(){

  },

  componentDidMount(){
    const position = [this.state.lat, this.state.lng];
    let map = L.map('app').setView(position, 4);
    L.tileLayer(MapBox.url, {
      attribution: MapBox.attribution,
      maxZoom: MapBox.maxZoom,
      id: MapBox.id,
      accessToken: MapBox.accessToken
    }).addTo(map);
    map.locate({setView: true, maxZoom: 16});
    function onLocationFound(e) {
      let radius = e.accuracy / 2;
      L.marker(e.latlng).addTo(map)
          .bindPopup("Du är inom en " + parseInt(radius) + " meters radie från denna punkt").openPopup();
      // L.circle(e.latlng, radius).addTo(map);
    }
    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
  },

  render() {
    return (
      <div>
      </div>
    );
  }
});

export default FullscreenMap;
