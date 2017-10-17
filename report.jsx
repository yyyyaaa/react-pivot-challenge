var React = require('react')
var ReactPivot = require('react-pivot')
var createReactClass = require('create-react-class')
var Emitter = require('wildemitter')

var rows = require('./data.json')

var dimensions = [
  {value: 'date', title: 'Date'},
  {value: 'host', title: 'Host'}
]

var reduce = function (row, memo) {
  memo.impressions = (memo.impressions || 0) + (row.type === 'impression' ? 1 : 0)
  memo.loads = (memo.loads || 0) + (row.type === 'load' ? 1 : 0)
  memo.displays = (memo.displays || 0) + (row.type === 'display' ? 1 : 0)
  memo.loadRate = (memo.loads / memo.impressions) * 100
  memo.displayRate = (memo.displays / memo.loads) * 100
  return memo
}

var calculations = [
  {
    title: 'Impressions', value: 'impressions'
  },
  {
    title: 'Loads', value: 'loads'
  },
  {
    title: 'Displays', value: 'displays'
  },
  {
    title: 'Load Rate',
    value: 'loadRate',
    template: presentRate
  },
  {
    title: 'Display Rate',
    value: 'displayRate',
    template: presentRate
  }
]

var persisted = JSON.parse(window.localStorage.rpSelections || '{}')
var bus = new Emitter()

module.exports = createReactClass({
  render () {
    return (
      <div className='report'>
        <ReactPivot rows={rows}
          dimensions={dimensions}
          reduce={reduce}
          calculations={calculations}
          activeDimensions={persisted.activeDimensions || ['Date', 'Host']}
          sortBy={persisted.sortBy}
          sortDir={persisted.sortDir}
          solo={persisted.solo}
          hiddenColumns={persisted.hiddenColumns}
          eventBus={bus}
        />
      </div>
    )
  }
})

function presentRate (value) {
  return parseFloat(value).toFixed(1) + '%'
}

bus.on('activeDimensions', function (activeDimensions) {
  persist('activeDimensions', activeDimensions)
})

bus.on('sortBy', function (sortBy) {
  persist('sortBy', sortBy)
})

bus.on('sortDir', function (sortDir) {
  persist('sortDir', sortDir)
})

bus.on('hiddenColumns', function (hiddenColumns) {
  persist('hiddenColumns', hiddenColumns)
})

bus.on('solo', function (solo) {
  persist('solo', solo)
})

function persist (prop, val) {
  persisted[prop] = val
  window.localStorage.rpSelections = JSON.stringify(persisted)
}
