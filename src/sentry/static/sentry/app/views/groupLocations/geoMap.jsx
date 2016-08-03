import React from 'react';
import {scaleLinear} from 'd3';
import Datamap from 'datamaps';

const GeoMap = React.createClass({
  propTypes: {
    series: React.PropTypes.array.isRequired // [COUNTRY_CODE, COUNT]
  },

  componentDidMount() {
    let {series} = this.props;

    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    let onlyValues = series.map(function(obj){ return obj[1]; });
    let minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    // color can be whatever you wish
    let paletteScale = scaleLinear()
            .domain([minValue,maxValue])
            .range(['#EFEFFF','#6958A2']); // purp

    // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
    //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }

    // fill dataset in appropriate format
    let dataset = series.reduce(function(obj, item){ //
        let [iso, value] = item; // ["USA", 70]

        obj[iso] = {
          numberOfThings: value,
          fillColor: paletteScale(value)
        };
        return obj;
    }, {});

    let map = new Datamap({
      element: this.refs['locations-container'],
      responsive: true,
      fills: {
        defaultFill: '#F5F5F5'
      },
      data: dataset,
      geographyConfig: {
          borderColor: '#DEDEDE',
          highlightBorderWidth: 2,
          highlightFillColor: function(geo) {
              return geo.fillColor || '#F5F5F5';
          },
          // only change border
          highlightBorderColor: '#6958A2',
          popupTemplate: function(geo, data) {
              // don't show tooltip if country not present in dataset
              if (!data) { return null; }
              // tooltip content
              return ['<div class="hoverinfo">',
                  '<strong>', geo.properties.name, '</strong>',
                  '<br>Events: <strong>', data.numberOfThings, '</strong>',
                  '</div>'].join('');
          }
      }
    });

    this._resizeListener = window.addEventListener('resize', function () {
      map.resize();
    });
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeListener);
  },

  render() {
    return <div height="600px" style={{border: '1px solid #D6DBE4', borderRadius: 4}} ref="locations-container"></div>;
  }
});

export default GeoMap;
