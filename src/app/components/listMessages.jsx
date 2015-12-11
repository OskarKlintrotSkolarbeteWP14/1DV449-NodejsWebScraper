import React from 'react';
import { JsonDateToDate, FormatDate } from '../scripts/helper';
import { Categories } from '../scripts/viewModel';
import Markers from '../scripts/markers';

const styles = {
  markers: {
    height: '150px',
    position: 'relative',
    overflow: 'auto',
  }
};

const ListMessages = React.createClass({
  componentDidMount() {
    const addToList = (message) => {
      $('div#markers').append(
        '<a href="#" class="list-link" data-message-id=\"'+message.feature.id+'\" title="' + message.feature.properties.title + '"><div class="info-list-item">' + '<div class="info-list-txt">' + '<div class="title">' + Categories[message.feature.properties.category] + ', ' + message.feature.properties.subcategory + ': ' + message.feature.properties.title + ', ' + message.feature.properties.exactlocation + '</div>' + '<div>' + message.feature.properties.description + '</div>' + '<div>' + FormatDate(message.feature.properties.createddate) + '</div>' + '</div>' + '</div>' + '</a>' + '<br />'
      );
    };

    for (const item of Markers.Sorted()) {
      addToList(item);
    }
    // for (const item in Markers.Map) {
    //   addToList(Markers.Map[item]);
    // }

    $('a.list-link').click(function (e) {
        const messageId = $(this).data('message-id');
        const marker = Markers.Map[messageId];
        marker.openPopup();
        // marker.openPopup(marker.getLatLng());

        e.preventDefault();
    });

  },

  render() {
    return (
      <div>
        <h4>Händelser</h4>
        <div id="markers" style={styles.markers}></div>
      </div>
    );
  }
});

export default ListMessages;
