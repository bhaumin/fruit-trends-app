import React from 'react';
import PropTypes from 'prop-types';
import CanvasJSReact from '../lib/canvasjs.react';

const FruitTypeChart = props => {
  // const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const { fruit, currentFruitType, currentFruitTypeDeliciousnessData } = props;
  const chartHeader = `${fruit.name} / ${currentFruitType} / "Deliciousness" over time`;

  if (!currentFruitTypeDeliciousnessData) {
    return (
      <div className="chart-container">
        <h6>{chartHeader}</h6>
        <small className="text-muted">No data points to display in the chart</small>
      </div>
    );
  }

  const { metaData, seriesData } = currentFruitTypeDeliciousnessData;
  const { idealIntervalType } = metaData;
  const { chartOptions, chartData } = seriesData[idealIntervalType];
  const { interval, xValueType, valueFormatString, intervalType } = chartOptions;

  const chartWidth = 600;
  const chartHeight = 400;
  const axisYMin = 0.8;
  const axisYMax = 5.2;

  const options = {
    animationEnabled: false,
    exportEnabled: false,
    theme: "light2", // "light1", "dark1", "dark2"
    width: chartWidth,
    height: chartHeight,
    title: {
      text: ""
    },
    axisY: {
      title: "level of deliciousness",
      includeZero: true,
      suffix: "",
      minimum: axisYMin,
      maximum: axisYMax,
    },
    axisX: {
      title: "time",
      valueFormatString,
      prefix: "",
      interval,
      intervalType,
    },
    data: [{
      type: "line",
      xValueType,
      xValueFormatString: valueFormatString,
      toolTipContent: "Time {x}: {y}",
      dataPoints: chartData
    }]
  };

  return (
    <div className="chart-container">
      <h6>{chartHeader}</h6>
      <CanvasJSChart options={options}
				/* onRef={ref => this.chart = ref} */
			/>
    </div>
  );
};

FruitTypeChart.propTypes = {
  fruit: PropTypes.object.isRequired,
  currentFruitType: PropTypes.string.isRequired,
  currentFruitTypeDeliciousnessData: PropTypes.object,
};


export default FruitTypeChart;
