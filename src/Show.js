const spacetime = require('spacetime')
const htm = require('htm')
const vhtml = require('vhtml')
const drawMonth = require('./month')

const styles = {
  container: `
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: center;
  flex-wrap: wrap;
  align-self: stretch;
  `
}

const defaults = {
  dim_past: true,
  show_today: true,
  show_weekends: true,
  show_numbers: false
}

class Show {
  constructor(start, end, options = {}) {
    this.start = spacetime(start)
    this.end = spacetime(end)
    this.options = Object.assign({}, defaults, options)
    this.data = {
      colors: {},
      underline: {}
    }
    this.h = htm.bind(vhtml)
  }
  bind(r) {
    this.h = htm.bind(r)
    return this
  }
  color(start, end, color) {
    start = spacetime(start)
    if (!color) {
      color = end
      end = start.add(1, 'day')
    }
    end = spacetime(end)
    start = start.minus(2, 'hours')
    start.every('day', end).forEach(d => {
      let date = d.format('iso-short')
      this.data.colors[date] = color
    })
  }
  underline(start, end, color) {
    start = spacetime(start)
    if (!color) {
      color = end
      end = start.add(1, 'day')
    }
    end = spacetime(end)
    start = start.minus(2, 'hours')
    start.every('day', end).forEach(d => {
      let date = d.format('iso-short')
      this.data.underline[date] = color
    })
  }
  build() {
    let beginning = this.start.clone()
    beginning = beginning.startOf('month').minus(2, 'hours')
    let months = beginning.every('month', this.end)
    months = months.map(d => drawMonth(d, this))
    return this.h`<div style="${styles.container}" >
      ${months}
    </div>`
  }
}

module.exports = Show
