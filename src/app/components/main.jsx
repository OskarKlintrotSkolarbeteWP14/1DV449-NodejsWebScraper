import React from 'react';
import FullscreenMap from './fullscreenMap';
// import MapComponent from './mapComponent';

import Messages from '../scripts/messages';

const Main = React.createClass({
  getInitialState() {
    return { data: null };
  },

  componentDidMount() {
    let development = true;

    if(development){
      // Cached response for development
      setTimeout(() => {
        this.setState({data: Messages});
      }, 500);
    }
    else {
      // We don't want to poll api.sr.se while devoloping this application
      $.get('http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false')
      .done((data) => {
        this.setState({data: data});
      })
      .fail(() => {
        console.log("Error fetching sr api");
      });
      // TODO: Checkout http://tc39.github.io/ecmascript-asyncawait/
    }
  },

  render() {
    if (this.state.data) {
      console.log(this.state.data);
      return (
          <FullscreenMap />
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
