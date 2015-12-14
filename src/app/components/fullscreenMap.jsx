import React from 'react'
import ProgressBar from './progressBar'
import FlashLink from './flashLink'
import LeafletMap, {LeafletSettings} from '../scripts/leafletMap'
import Markers from '../scripts/markers'
import MessageBox from './messageBox'
import SrApi from '../scripts/srApi'

class FullscreenMap extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      markers: null,
      lat: 63,
      lng: 15,
      zoom: 13,
      data: null
    }
  }

  setLeafletSetting(){
    for (let property in this.state) {
      if(LeafletSettings.hasOwnProperty(property))
        LeafletSettings[property] = this.state[property]
    }
  }

  getGeoJSON(){
    return LeafletMap.GetGeoJSON(this.state.data.messages)
  }

  componentWillMount(){
    this.setLeafletSetting()
    try {
      LeafletMap.Initialise({geolocation: true})
    } catch (e) {
      console.error(e)
    }
  }

  componentDidMount() {
    SrApi.$http()
    .get()
    .then((data) => {
      let geoJSON = LeafletMap.GetGeoJSON(JSON.parse(data).messages)
      let markerMap = LeafletMap.AddGeoJSONMarkers(geoJSON)
      Markers.Map = markerMap
      this.setState({
        markers: Markers.Sorted()
      })
    })
    .catch((data) => {console.log(data)}) // TODO: Implement modal
  }

  render() {
    if(this.state.markers) {
      return(
        <MessageBox>
          <FlashLink data={this.state.markers} />
        </MessageBox>
      )
    }
    else {
      return (
        <MessageBox>
          <ProgressBar />
        </MessageBox>
      )
    }
  }
}

export default FullscreenMap
