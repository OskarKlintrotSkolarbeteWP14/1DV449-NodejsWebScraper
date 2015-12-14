import React, { PropTypes } from 'react'
import FlashLink from './flashLink'

const ListMessages = props => {
  let {data} = props

  return (
    <div>
      <h4>Händelser</h4>
      <div id="listcontainer">
        <div id="markers">
          <FlashLink data={data} />
        </div>
      </div>
    </div>
  )
}

ListMessages.propTypes = {
  data: React.PropTypes.array.isRequired
}

export default ListMessages
