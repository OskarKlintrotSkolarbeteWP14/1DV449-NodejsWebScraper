import React, { PropTypes } from 'react'

const MessageBox = props => {
  let {children} = props

  return (
    <div>
      <h4>Händelser</h4>
      <div id="listcontainer">
        <div id="markers">
          {children}
        </div>
      </div>
    </div>
  )
}

export default MessageBox
