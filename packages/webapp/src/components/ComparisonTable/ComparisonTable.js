// @flow
import ArtifactCell from './ArtifactCell';
import IconX from '../icons/IconX';
import { interpolateHcl } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';
import styles from './styles';
import theme from '../../theme';
import BuildComparator, { CellType } from 'build-tracker-comparator';
import { Button, Clipboard, Text, View } from 'react-native';
import { bytesToKb, formatSha } from '../../modules/formatting';
import { hsl, rgb } from 'd3-color';
import React, { Component, PureComponent } from 'react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from '../Table';

import type { Build } from '../../types';

const identity = d => d;

const flatten = (arrays: Array<any>) => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);

const greenScale = scaleLinear()
  .domain([1, 0])
  .interpolate(interpolateHcl)
  .range([rgb('#d0f8d7'), rgb('#55e86e')]);
const redScale = scaleLinear()
  .domain([1, 2])
  .interpolate(interpolateHcl)
  .range([rgb('#fde2e1'), rgb('#f7635b')]);

class RevisionHeaderCell extends PureComponent {
  props: {
    onClickInfo: Function,
    onClickRemove: Function,
    revision: string
  };

  render() {
    const { revision } = this.props;
    return (
      <Th style={[styles.cell, styles.header]} title={revision}>
        <View style={styles.headerContent}>
          <Text onClick={this._handleClickInfo} style={styles.headerSha}>
            {formatSha(revision)}
          </Text>
          <View onClick={this._handleClickRemove} style={[styles.headerButton, styles.removeBuild]}>
            <IconX />
          </View>
        </View>
      </Th>
    );
  }

  _handleClickRemove = () => {
    const { onClickRemove, revision } = this.props;
    onClickRemove && onClickRemove(revision);
  };

  _handleClickInfo = () => {
    const { onClickInfo, revision } = this.props;
    onClickInfo && onClickInfo(revision);
  };
}

class RevisionDeltaCell extends Component {
  props: {
    againstRevision: string,
    deltaIndex: number,
    revision: string
  };

  render() {
    const { againstRevision, deltaIndex, revision } = this.props;
    return (
      <Th
        style={[styles.cell, styles.header]}
        title={`Delta from ${formatSha(againstRevision)} to ${formatSha(revision)}`}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerSha}>{`𝚫${deltaIndex}`}</Text>
        </View>
      </Th>
    );
  }
}

const getBodySorter = (artifactNames: Array<string>) => (a: string, b: string): number => {
  return artifactNames.indexOf(a) - artifactNames.indexOf(b);
};

class DeltaCell extends Component {
  props: {
    size: number,
    sizePercent: number,
    gzipSize: number,
    gzipSizePercent: number,
    hashChanged: boolean,
    valueAccessor: Function
  };

  render() {
    const { gzipSizePercent, valueAccessor } = this.props;
    const value = valueAccessor(this.props);
    const backgroundColor =
      gzipSizePercent > 1
        ? redScale(Math.max(Math.min(gzipSizePercent, 2), 1))
        : gzipSizePercent === 1 ? 'transparent' : greenScale(Math.max(Math.min(gzipSizePercent, 1), 0));
    return (
      <Td style={[styles.cell, backgroundColor && { backgroundColor }]}>
        <Text>{value ? bytesToKb(value) : '-'}</Text>
      </Td>
    );
  }
}

class ValueCell extends Component {
  props: {
    size: number,
    gzipSize: number,
    valueAccessor: Function
  };

  render() {
    const { valueAccessor } = this.props;
    const value = valueAccessor(this.props);
    return (
      <Td style={[styles.cell]}>
        <Text>{value ? bytesToKb(value) : '-'}</Text>
      </Td>
    );
  }
}

const sortBuilds = (a, b) => a.meta.timestamp - b.meta.timestamp;

type ComparisonProps = {
  activeArtifactNames: Array<string>,
  builds: Array<Build>,
  artifactNames: Array<string>,
  colorScale: Function,
  hoveredArtifact?: string,
  onArtifactsChange?: Function,
  onRemoveBuild?: Function,
  onShowBuildInfo?: Function,
  valueAccessor: Function
};

type ComparisonState = {
  showAboveThresholdOnly: boolean,
  showDeselectedArtifacts: boolean
};

export default class Comparisons extends PureComponent {
  props: ComparisonProps;
  state: ComparisonState;
  _data: typeof BuildComparator;

  constructor(props: ComparisonProps, context: Object) {
    super(props, context);
    this.state = {
      showAboveThresholdOnly: false,
      showDeselectedArtifacts: true
    };
    this.setData(props);
  }

  componentWillUpdate(nextProps: ComparisonProps, nextState: ComparisonState) {
    this.setData(nextProps);
  }

  setData(props: ComparisonProps) {
    const matrixBodySorter = getBodySorter(props.artifactNames);
    this._data = props.builds.length && new BuildComparator(props.builds.sort(sortBuilds), matrixBodySorter);
  }

  render() {
    const { activeArtifactNames, builds } = this.props;
    const { showAboveThresholdOnly, showDeselectedArtifacts } = this.state;

    const headers = this._data.matrixHeader;
    const totals = this._data.matrixTotal;
    const body = this._data.matrixBody;

    return this._data ? (
      <View style={styles.root}>
        <Table style={styles.dataTable}>
          <Thead>
            <Tr>{headers ? headers.map(this._renderHeaderCell) : null}</Tr>
          </Thead>
          <Tbody>
            {totals.length ? <Tr>{totals.map(this._renderValueCell)}</Tr> : null}
            {body.length
              ? body.map((row, i) => {
                  const artifactName = row[0].text;
                  if (!showDeselectedArtifacts) {
                    if (activeArtifactNames.indexOf(artifactName) === -1) {
                      return null;
                    }
                  }
                  return <Tr key={i}>{row.map((cell, i) => this._renderBodyCell(cell, i, artifactName))}</Tr>;
                })
              : null}
          </Tbody>
          {builds.length > 1 ? (
            <Tfoot>
              <Tr>
                <ArtifactCell
                  active={showAboveThresholdOnly}
                  artifactName="Above threshold only"
                  disabled={false}
                  color={theme.colorMidnight}
                  onToggle={this._handleRemoveBelowThreshold}
                />
                <Td colSpan={headers.length - 1} rowSpan={2} style={styles.footer}>
                  <View style={styles.footerContent}>
                    <View style={styles.copyButton}>
                      <Button onPress={this._handleCopyToAscii} style={styles.copyButton} title="Copy to ASCII" />
                    </View>
                    <View style={styles.copyButton}>
                      <Button onPress={this._handleCopyToCSV} style={styles.copyButton} title={'Copy to CSV'} />
                    </View>
                  </View>
                </Td>
              </Tr>
              <Tr>
                <ArtifactCell
                  active={showDeselectedArtifacts}
                  artifactName="Show deselected"
                  color={theme.colorMidnight}
                  onToggle={this._handleShowDeselected}
                />
              </Tr>
            </Tfoot>
          ) : null}
        </Table>
      </View>
    ) : null;
  }

  _renderHeaderCell = (cell, i: number) => {
    const { onRemoveBuild, onShowBuildInfo } = this.props;
    switch (cell.type) {
      case CellType.REVISION_HEADER:
        return <RevisionHeaderCell {...cell} key={i} onClickRemove={onRemoveBuild} onClickInfo={onShowBuildInfo} />;
      case CellType.REVISION_DELTA_HEADER:
        return <RevisionDeltaCell {...cell} key={i} />;
      default:
        return <Th style={[styles.cell, styles.header]} />;
    }
  };

  _renderValueCell = (cell, i: number) => {
    const { activeArtifactNames, artifactNames, valueAccessor } = this.props;
    switch (cell.type) {
      case CellType.ARTIFACT:
        return (
          <ArtifactCell
            active={activeArtifactNames.length === artifactNames.length}
            artifactName="All"
            color={theme.colorMidnight}
            disabled={activeArtifactNames.length === artifactNames.length}
            key={i}
            onToggle={this._handleToggleAllArtifacts}
            link="/"
          />
        );
      case CellType.DELTA:
        return <DeltaCell {...cell} key={i} valueAccessor={valueAccessor} />;
      case CellType.TOTAL:
      default:
        return <ValueCell {...cell} key={i} valueAccessor={valueAccessor} />;
    }
  };

  _renderBodyCell = (cell, i: number, artifactName: string) => {
    const { activeArtifactNames, artifactNames, colorScale, hoveredArtifact, valueAccessor } = this.props;
    const isHovered = hoveredArtifact === artifactName;
    const color = colorScale(1 - artifactNames.indexOf(artifactName));
    const hoverColor = hsl(color);
    hoverColor.s = 0.7;
    hoverColor.l = 0.95;

    switch (cell && cell.type) {
      case CellType.ARTIFACT:
        return (
          <ArtifactCell
            active={activeArtifactNames.indexOf(artifactName) !== -1}
            artifactName={artifactName}
            color={color}
            hoverColor={hoverColor.toString()}
            isHovered={isHovered}
            key={i}
            onToggle={this._handleToggleArtifact}
            link={`/${artifactName}`}
          />
        );
      case CellType.DELTA:
        return <DeltaCell {...cell} key={i} valueAccessor={valueAccessor} />;
      case CellType.TOTAL:
      default:
        return <ValueCell {...cell} key={i} valueAccessor={valueAccessor} />;
    }
  };

  _getActiveData() {
    const { activeArtifactNames } = this.props;
    return this._data.matrixBody.filter((row, i) => {
      return i === 0 || (row[0].text && activeArtifactNames.indexOf(row[0].text) !== -1);
    });
  }

  _getFilteredData() {
    const { valueAccessor } = this.props;
    return this._data.matrixBody.filter((row, i) => {
      // TODO: should this threshold on percent change?
      const deltas = row.filter(column => column && !column.hash && valueAccessor(column) > 100);
      if (i !== 0 && row.length > 2 && deltas.length === 0) {
        return false;
      }
      return true;
    });
  }

  _handleShowDeselected = (name: string, toggled: boolean) => {
    this.setState({ showDeselectedArtifacts: toggled });
  };

  _handleRemoveBelowThreshold = (name: string, toggled: boolean) => {
    const { artifactNames, onArtifactsChange } = this.props;
    this.setState({ showAboveThresholdOnly: toggled }, () => {
      if (onArtifactsChange) {
        if (toggled) {
          const data = this._getFilteredData();
          onArtifactsChange(data.map(row => row[0].text));
        } else {
          onArtifactsChange(artifactNames);
        }
      }
    });
  };

  _handleToggleArtifact = (artifactName: string, value: boolean) => {
    const { activeArtifactNames, onArtifactsChange } = this.props;
    if (onArtifactsChange) {
      if (value) {
        onArtifactsChange([...activeArtifactNames, artifactName]);
      } else {
        onArtifactsChange(activeArtifactNames.filter(b => b !== artifactName));
      }
    }
  };

  _handleToggleAllArtifacts = (value: boolean) => {
    const { artifactNames, onArtifactsChange } = this.props;
    onArtifactsChange && onArtifactsChange(artifactNames);
  };

  _handleCopyToAscii = () => {
    const { valueAccessor } = this.props;
    const formatValue = cell => {
      const value = valueAccessor(cell);
      return value ? bytesToKb(value) : '';
    };
    const table = this._data.getAscii({
      formatRevision: cell => formatSha(cell.revision),
      formatValue,
      formatDelta: formatValue
    });

    // Clipboard requires using template strings and special encoding for newlines and spaces
    Clipboard.setString(
      `${table
        .toString()
        .replace(/\r?\n/g, `\r\n`)
        .replace(/ /g, `\u00A0`)}`
    );
  };

  _handleCopyToCSV = () => {
    Clipboard.setString(this._data.getCsv());
  };
}
