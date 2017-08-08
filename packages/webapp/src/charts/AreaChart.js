// @flow
import { area, stack } from 'd3-shape';
import { extent, max } from 'd3-array';
import { mouse, select } from 'd3-selection';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { interpolateRainbow, scaleSequential, scaleTime, scaleLinear, scalePoint, scalePow } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import 'd3-transition';

const color = scaleSequential(interpolateRainbow);
const margin = { top: 20, right: 20, bottom: 100, left: 60 };
const formatTime = timeFormat('%Y-%m-%d %H:%M');

const PERCENT_Y_HEADROOM = 1.05;

const getInitialSize = (stats, bundle) => (stats[0].stats[bundle] ? stats[0].stats[bundle].gzipSize : 0);

export const YScaleType = {
  LINEAR: 'linear',
  POW: 'pow'
};

export const XScaleType = {
  TIME: 'time',
  COMMIT: 'commit'
};

type bundleStatType = {
  hash: string,
  name: string,
  size: number,
  gzipSize: number
};

export default class AreaChart extends Component {
  props: {
    bundles: Array<string>,
    onHover: Function,
    yScaleType: 'linear' | 'pow',
    xScaleType: 'time' | 'commit',
    stats: Array<{
      build: { timestamp: number, revision: string },
      stats: { [bundleName: string]: bundleStatType }
    }>
  };

  state: {
    width: number,
    height: number
  };

  _svgNode: any;
  _chartContents: any;
  _overlay: any;
  _hoverLine: any;
  _yAxis: any;
  _xAxis: any;

  static defaultProps = {
    yScaleType: YScaleType.LINEAR,
    xScaleType: XScaleType.COMMIT
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this._renderChart();
  }

  componentDidUpdate() {
    this._renderChart();
  }

  render() {
    const { height, width } = this.state;
    return (
      <View onLayout={this._handleLayout} style={styles.root}>
        <svg ref={this._setSvgRef} height={height} width={width} />
      </View>
    );
  }

  _renderChart() {
    const { height, width } = this.state;
    const { bundles, stats, xScaleType } = this.props;
    if (height === 0 || width === 0) {
      return;
    }

    color.domain([0, bundles.length]);

    const yScale = this._getYScale();
    const xScale = this._getXScale();

    const xAccessor = xScaleType === 'time' ? 'timestamp' : 'revision';
    const areaChart = area().x(d => xScale(d.data.build[xAccessor])).y0(d => yScale(d[0])).y1(d => yScale(d[1]));

    const chartStack = stack();
    chartStack.keys(bundles.sort((a, b) => getInitialSize(stats, b) - getInitialSize(stats, a)));
    chartStack.value((d, key) => (d.stats[key] ? d.stats[key].gzipSize : 0));

    const data = chartStack(stats);

    const bundle = this._chartContents.selectAll('.bundle').data(data, d => (bundles.length > 1 ? d.key : 'constant'));

    // Remove old areas
    bundle.exit().remove();

    bundle
      .enter()
      .append('path')
      .attr('class', 'bundle')
      .merge(bundle)
      .transition()
      .duration(150)
      .attr('d', areaChart)
      .style('fill', (d, i) => color(bundles.indexOf(d.key)));

    this._drawXAxis(xScale);
    this._drawYAxis(yScale);

    this._overlay
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .on('mousemove', (d, index, nodes) => {
        const [xPos, yPos] = mouse(nodes[0]);

        let xValue;
        if (xScale.invert) {
          const xDate = xScale.invert(xPos);
          const validTimestamps = stats.map(d => d.build.timestamp);
          xValue = validTimestamps.reduce(
            (prev, curr) => (Math.abs(curr - xDate) < Math.abs(prev - xDate) ? curr : prev),
            0
          );
        } else {
          const domain = xScale.domain();
          xValue = domain.reduce((prev, curr, i) => {
            return Math.abs(xScale(curr) - xPos) > Math.abs(xScale(prev) - xPos) ? prev : curr;
          }, domain[0]);
        }
        this._hoverLine
          .attr('x1', xScale(xValue))
          .attr('x2', xScale(xValue))
          .attr('y1', 0)
          .attr('y2', height - margin.top - margin.bottom);
        this.props.onHover(xValue);
      });
  }

  _setSvgRef = (node: Object) => {
    if (node !== this._svgNode) {
      this._svgNode = node;
      const svg = select(node).append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      this._chartContents = svg.append('g');
      this._overlay = svg.append('rect').style('fill', 'none').style('pointer-events', 'all');
      this._hoverLine = svg
        .append('line')
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', '1.5px')
        .style('stroke-dasharray', '3 3');
      this._xAxis = svg.append('g').attr('class', 'x axis');
      this._yAxis = svg.append('g').attr('class', 'y axis');
    }
  };

  _drawXAxis(xScale: Object) {
    const { height } = this.state;
    const xAxis = this._getXAxis(xScale);
    this._xAxis
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .transition()
      .duration(150)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 9)
      .attr('x', 5)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(24)')
      .style('text-anchor', 'start');
  }

  _drawYAxis(yScale: Object) {
    const yAxis = axisLeft().scale(yScale);
    this._yAxis.transition().duration(150).call(yAxis);
  }

  _handleLayout = (event: Object) => {
    const { nativeEvent: { layout: { width, height } } } = event;
    if (width !== this.state.width) {
      this.setState({ height, width });
    }
  };

  _getXScale() {
    const { stats, xScaleType } = this.props;
    const { width } = this.state;

    const range = [0, width - (margin.left + margin.right)];
    switch (xScaleType) {
      case XScaleType.TIME:
        return scaleTime().range(range).domain(extent(stats, d => d.build.timestamp));

      case XScaleType.COMMIT:
      default: {
        const domain = stats
          .sort((a, b) => new Date(a.build.timestamp) - new Date(b.build.timestamp))
          .map(d => d.build.revision);
        return scalePoint().range(range).round(true).domain(domain);
      }
    }
  }

  _getXAxis(scale: Object) {
    const { stats, xScaleType } = this.props;
    const axis = axisBottom().scale(scale);
    switch (xScaleType) {
      case XScaleType.TIME:
        axis.tickFormat(formatTime);
        break;

      default:
        axis.tickFormat(d => d && d.slice(0, 7));
        break;
    }
    return axis;
  }

  _getYScale() {
    const { stats, yScaleType } = this.props;
    const { height } = this.state;

    const maxDateVal = max(stats, commit => {
      return Object.values(commit.stats).reduce(
        (memo, bundle) => memo + (bundle && bundle.gzipSize ? parseInt(bundle.gzipSize, 10) : 0),
        0
      );
    });

    const range = [height - (margin.top + margin.bottom), 0];
    const domain = [0, maxDateVal * PERCENT_Y_HEADROOM];

    switch (yScaleType) {
      case YScaleType.POW:
        return scalePow().exponent(4).range(range).domain(domain);
      case YScaleType.LINEAR:
      default:
        return scaleLinear().range(range).domain(domain);
    }
  }
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    height: '100%'
  }
});
