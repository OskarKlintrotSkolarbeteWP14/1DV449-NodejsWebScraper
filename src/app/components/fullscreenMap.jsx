import React from 'react';
import LeafletMap, {LeafletSettings} from '../scripts/leafletMap';
import Markers from '../scripts/markers';
import ListMessages from './listMessages';

const FullscreenMap = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
      markers: null,
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

  componentWillMount(){
    this.setLeafletSetting();
    LeafletMap.Initialise({geolocation: true});
    let geoJSON = this.getGeoJSON();
    let markerMap = LeafletMap.AddGeoJSONMarkers(geoJSON);
    Markers.Map = markerMap;
    this.setState({
      markers: Markers.Sorted()
    });
  },

  render() {
    return(
      <ListMessages data={this.state.markers} />
    );
  }
});

export default FullscreenMap;
