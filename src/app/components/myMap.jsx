import React from 'react';

const styles = {
  map: {

  }
};

const MyMap = React.createClass({
  propTypes: {
    // add: React.PropTypes.number
  },

  getInitialState(){
    return {
      lat: 51.505,
      lng: -0.09,
      zoom: 13
    };
  },

  getDefaultProps(){

  },

  componentDidMount(){
    console.log(L);
  },

  render() {
    const position = [this.state.lat, this.state.lng];
    let myMap = L.map('app').setView([51.505, -0.09], 13);

    return (
      <div id="map" styles={styles.map}>
        Te
      </div>
    );
  }
});

export default MyMap;
