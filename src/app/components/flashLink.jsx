import React, { PropTypes } from 'react'
import LeafletMap, { LeafletSettings } from '../scripts/leafletMap'
import { FormatDate } from '../scripts/helper'
import { Categories } from '../scripts/viewModel'
import Markers from '../scripts/markers'

class FlashLink extends React.Component{
  constructor(props) {
    super(props)
  }

  renderList(){
    let list = []
    this.props.data.map((message) => {
      let exactlocation = message.feature.properties.exactlocation ? ', ' + message.feature.properties.exactlocation : ''
      let description = message.feature.properties.description ? message.feature.properties.description : ''

      list.push(
        <a href="#" className="list-link" title={message.feature.properties.title} onClick={(e) => {
            const marker = Markers.Map[message.feature.id]
            marker.openPopup()
            e.preventDefault()
        }}>
          <div>
            <strong>
              {Categories[message.feature.properties.category] + ', ' + message.feature.properties.subcategory + ': '}
            </strong>{message.feature.properties.title + exactlocation}
          </div>
          <div>
            {description}
          </div>
          <div>
            {FormatDate(message.feature.properties.createddate)}
          </div>
          <br />
        </a>
      )
    })
    return list
  }

  render() {
    let list = this.renderList()
    return(
      <div>
        {list}
      </div>
    )
  }
}

FlashLink.propTypes = {
  data: React.PropTypes.array.isRequired
}

export default FlashLink
