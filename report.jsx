var React = require('react')
var ReactPivot = require('react-pivot')
var createReactClass = require('create-react-class')

var rows = require('./data.json')

module.exports = createReactClass({
  render () {
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

    return (
      <div className='report'>
        <ReactPivot rows={rows}
          dimensions={dimensions}
          reduce={reduce}
          calculations={calculations}
          activeDimensions={['Date', 'Host']}
        />
      </div>
    )
  }
})

function presentRate (value) {
  return parseFloat(value).toFixed(1) + '%'
}
