import React from 'react';
import FullscreenMap from './fullscreenMap';
import SrApi from '../scripts/srApi';
// import MapComponent from './mapComponent';

import Messages from '../scripts/messages';

const Main = React.createClass({
  getInitialState() {
    return { data: null };
  },

  componentDidMount: function() {
    let development = true;

    if(development){
      // Cached response for development
      setTimeout(() => {
        this.setState({data: Messages});
      }, 500);
    }
    else {
      // We don't want to poll api.sr.se while devoloping this application
      SrApi.$http()
      .get()
      .then((data) => {this.setState({data: JSON.parse(data)});})
      .catch((data) => {console.log(data);}); // TODO: Implement modal
    }
  },

  render() {
    if (this.state.data) {
      return (
          <FullscreenMap data={this.state.data} />
      );
      // return <CategoriesSetup data={this.state.data} />;
    }

    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" role="progressbar" ariaValuenow="45" ariaValuemin="0" ariaValuemax="100" style={{width: "100%"}}>
          <span className="sr-only">Laddar sidan...</span>
        </div>
      </div>
    );
  }

});

export default Main;
