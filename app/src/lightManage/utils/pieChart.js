/**
 * created by m on 2018/01/8
 */
// import { intlFormat } from '../util/index';
export default function PieChart(data) {
  let width = data.width ? data.width : data.wrapper.offsetWidth;
  // var width = 148;
  var height = data.height ? data.height : data.wrapper.offsetHeight;
  // var height = 170;  
  let dataset = data.data;
  let ID = data.wrapper.id;
  let parent = d3.select(`#${ID}`);
  if (parent == null) {return;}
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  if (data.color) {
    color = d3.scaleOrdinal().domain(d3.range(data.color.length)).range(data.color);
  }
  var pie = d3.pie()
    .value(function(d, i) { return d; })
    .padAngle(0.03)
    .sort(null);

  var arc = d3.arc()
    .innerRadius(48)
    .outerRadius(58)
    .cornerRadius(20);

  var svg = parent.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('style', 'width:100%')
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  //   var path = svg.datum(dataset).selectAll('path')
  svg.datum(dataset).selectAll('path')
    .data(pie)
    .enter().append('path')
    .attr('fill', function(d, i) { return color(i); })
    .attr('d', arc)
    .each(function(d) { this._current = d; }); // store the initial angles

  // function arcTween(a) {
  //   var i = d3.interpolate(this._current, a);
  //   this._current = i(0);
  //   return function(t) {
  //     return arc(i(t));
  //   };
  // }

  return {
    destroy: function() {
      parent.select('svg').remove();
    },
  };
}