/*
 * This module has a static property that keeps all
 * markers on the map. This is more or less the
 * module that handles the state of the app.
 */

function Markers() {
  // Empty
}

Markers.Map = {}

Markers.Sorted = () => {
  let sorted = []

  for (const item in Markers.Map) {
    sorted.push(Markers.Map[item])
  }

  sorted.sort((a, b) => {
    return b.feature.properties.createddate - a.feature.properties.createddate
  })

  return sorted
}

export default Markers
