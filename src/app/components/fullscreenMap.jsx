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

  componentDidMount(){
    console.log(this.props.data);

    for (let property in this.state) {
      if(LeafletSettings.hasOwnProperty(property))
        LeafletSettings[property] = this.state[property];
    }

    LeafletMap.Initialise({geolocation: true});
  },

  render() {
    return null;
  }
});

export default FullscreenMap;
