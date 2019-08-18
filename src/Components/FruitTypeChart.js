import React from 'react';
import CanvasJSReact from '../lib/canvasjs.react';

const FruitTypeChart = props => {
  // const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const { fruit, currentFruitType, currentFruitTypeDeliciousness } = props;

  const chartHeader = `${fruit.name} / ${currentFruitType} / "Deliciousness" over time`;

  const options = {
    animationEnabled: false,
    exportEnabled: false,
    theme: "light2", // "light1", "dark1", "dark2"
    height: 400,
    width: 600,
    title: {
      text: ""
    },
    axisY: {
      title: "level of deliciousness",
      includeZero: false,
      suffix: ""
    },
    axisX: {
      title: "time",
      valueFormatString: "YYYY-MM",
      prefix: "",
      interval: 1
    },
    data: [{
      type: "line",
      // xValueType: "dateTime",
      xValueFormatString: "YYYY-MM",
      toolTipContent: "Time {x}: {y}",
      dataPoints: currentFruitTypeDeliciousness
    }]
  };

  return (
    <div className="fruit-types-chart-container">
      <h6>{chartHeader}</h6>
      <CanvasJSChart options={options}
				/* onRef={ref => this.chart = ref} */
			/>
    </div>
  );
};

export default FruitTypeChart;
