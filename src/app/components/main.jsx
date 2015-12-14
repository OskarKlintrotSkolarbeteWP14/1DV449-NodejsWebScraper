import React from 'react'
import FullscreenMap from './fullscreenMap'
import ProgressBar from './progressBar'
import SrApi from '../scripts/srApi'
import Messages from '../scripts/messages'

class Main extends React.Component{
  constructor(props) {
    super(props)
    this.state = {data: null}
  }

  componentDidMount() {
    SrApi.$http()
    .get()
    .then((data) => {this.setState({data: JSON.parse(data)})})
    .catch((data) => {console.log(data)}) // TODO: Implement modal
  }

  render() {
    if (this.state.data) {
      return (
        <div id="list">
          <FullscreenMap data={this.state.data} />
        </div>
      )
    } else {
      return (
        <ProgressBar />
      )
    }
  }
}

export default Main
