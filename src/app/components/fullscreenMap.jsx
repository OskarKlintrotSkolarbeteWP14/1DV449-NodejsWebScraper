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

  addLeafletMarkers(){
    for (let message in this.props.data.messages) {
      let temp = {};
      for (let property in this.props.data.messages[message]) {
        temp[property] = this.props.data.messages[message][property];
      }
      LeafletMap.AddMarker(temp);
    }
  },

  componentDidMount(){
    this.setLeafletSetting();

    LeafletMap.Initialise({geolocation: true});

    this.addLeafletMarkers();
  },

  render() {
    return null;
  }
});

export default FullscreenMap;
