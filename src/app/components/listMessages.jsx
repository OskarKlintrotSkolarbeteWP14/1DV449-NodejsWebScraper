import React from 'react';
import FlashLink from './flashLink';
// import { JsonDateToDate, FormatDate } from '../scripts/helper';
// import { Categories } from '../scripts/viewModel';
import Markers from '../scripts/markers';

const ListMessages = React.createClass({
  getInitialState(){
    return{
      data: null
    };
  },

  componentDidMount() {
    this.setState({data: Markers.Sorted()});
  },

  render() {
    if(this.state.data) {
      return (
        <div>
          <h4>Händelser</h4>
          <div id="listcontainer">
            <div id="markers">
              <FlashLink data={this.state.data} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h4>Händelser</h4>
          <div id="listcontainer">
            <div id="markers"><h3>Laddar...</h3></div>
          </div>
        </div>
      );
    }
  }
});

export default ListMessages;
