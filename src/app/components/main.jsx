import React from 'react';
import FullscreenMap from './fullscreenMap';
import ProgressBar from './progressBar';
import SrApi from '../scripts/srApi';

import Messages from '../scripts/messages';

const Main = React.createClass({
  getInitialState() {
    return { data: null };
  },

  componentDidMount: function() {
    let development = false;

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
    }

    return (
      <ProgressBar />
    );
  }

});

export default Main;
