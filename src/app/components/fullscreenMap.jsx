import React from 'react';
import LeafletMap, {LeafletSettings} from '../scripts/leafletMap';
import Markers from '../scripts/markers';

const FullscreenMap = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
      lat: 63,
      lng: 15,
      zoom: 13
    };
  },

  setLeafletSetting(){
    for (let property in this.state) {
      if(LeafletSettings.hasOwnProperty(property))
        LeafletSettings[property] = this.state[property];
    }
  },

  getGeoJSON(){
    return LeafletMap.GetGeoJSON(this.props.data.messages);
  },

  componentDidMount(){
    this.setLeafletSetting();
    LeafletMap.Initialise({geolocation: true});
    let geoJSON = this.getGeoJSON();
    let markerMap = LeafletMap.AddGeoJSONMarkers(geoJSON);
    Markers.Map = markerMap;
  },

  render() {
    return null;
  }
});

export default FullscreenMap;
