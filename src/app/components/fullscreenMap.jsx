import React from 'react';
import LeafletMap, {LeafletSettings} from '../scripts/leafletMap';

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

    LeafletMap.AddGeoJSONMarkers(geoJSON);

    LeafletMap.AddPanel();
  },

  render() {
    return null;
  }
});

export default FullscreenMap;
