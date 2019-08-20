import moment from 'moment';

// Note about interval types:
// Keep it in decreasing order - year > month > day

// Further granular interval types like "hour" or "minute"
// could be added if you implement its rollup logic in
// the rollupDataSeriesData() method below and define
// the corresponding chart options in getChartOptions()
const intervalTypes = [ "year", "month", "day" ];
let apiXKey = "x";
let apiYKey = "y";

const updateApiKeys = (xKey, yKey) => {
  apiXKey = xKey;
  apiYKey = yKey;
};

const getDurationSpan = (dataSeries) => {
  let durationSpanCount = 0;
  let durationSpanType = null;

  if (dataSeries && dataSeries.length > 0) {
    const n = dataSeries.length;
    const firstDate = moment(dataSeries[0][apiXKey]);
    const lastDate = moment(dataSeries[n-1][apiXKey]);
    const diff = lastDate.diff(firstDate);
    const dur = moment.duration(diff);

    if (dur.asYears() >= 1) {
      durationSpanCount = Math.floor(dur.asYears());
      durationSpanType = "year";
    } else if (dur.asMonths() >= 1) {
      durationSpanCount = Math.floor(dur.asMonths());
      durationSpanType = "month";
    } else if (dur.asWeeks() >= 1) {
      durationSpanCount = Math.floor(dur.asWeeks());
      durationSpanType = "week";
    } else {
      durationSpanCount = Math.floor(dur.asDays());
      durationSpanType = "day";
    }

    durationSpanCount++;
  }

  return {durationSpanCount, durationSpanType};
};

const rollupDataSeriesData = (dataSeries, spanType) => {
  const rolledUpSeries = {};

  for (let dataPoint of dataSeries) {
    switch(spanType) {
      case "year":
        initRollupSeries(rolledUpSeries, "year");
        initRollupSeries(rolledUpSeries, "month");
        addToYearlySeries(dataPoint, rolledUpSeries["year"]);
        addToMonthlySeries(dataPoint, rolledUpSeries["month"]);
        break;
      case "month":
        initRollupSeries(rolledUpSeries, "month");
        initRollupSeries(rolledUpSeries, "day");
        addToMonthlySeries(dataPoint, rolledUpSeries["month"]);
        addToDailySeries(dataPoint, rolledUpSeries["day"]);
        break;
      case "week":
      case "day":
        initRollupSeries(rolledUpSeries, "day");
        addToDailySeries(dataPoint, rolledUpSeries["day"]);
        break;
      default:
        break;
    }
  }

  return rolledUpSeries;
};

const initRollupSeries = (series, type) => {
  if (!series.hasOwnProperty(type)) {
    series[type] = [];
  }
};

const addToYearlySeries = (dataPoint, targetSeries) => {
  const n = targetSeries.length;
  const lastDataPoint = n > 0 ? targetSeries[n-1] : null;
  const newMoment = moment(dataPoint[apiXKey]);
  const newYearTimestamp = moment([ newMoment.year(), 0 ]).valueOf();
  const lastYearTimestamp = lastDataPoint ? lastDataPoint.x : null;
  const newY = dataPoint[apiYKey];

  if (newYearTimestamp && lastYearTimestamp && newYearTimestamp === lastYearTimestamp) {
    // merge
    mergeWithLastDataPoint(lastDataPoint, newY);
  } else {
    // add
    targetSeries.push({x: newYearTimestamp, y: newY, totalY: newY, count: 1});
  }
};

const addToMonthlySeries = (dataPoint, targetSeries) => {
  const n = targetSeries.length;
  const lastDataPoint = n > 0 ? targetSeries[n-1] : null;
  const newMoment = moment(dataPoint[apiXKey]);
  const newMonthTimestamp = moment([ newMoment.year(), newMoment.month() ]).valueOf();
  const lastMonthTimestamp = lastDataPoint ? lastDataPoint.x : null;
  const newY = dataPoint[apiYKey];

  if (newMonthTimestamp && lastMonthTimestamp && newMonthTimestamp === lastMonthTimestamp) {
    // merge
    mergeWithLastDataPoint(lastDataPoint, newY);
  } else {
    // add
    targetSeries.push({x: newMonthTimestamp, y: newY, totalY: newY, count: 1});
  }
};

const addToDailySeries = (dataPoint, targetSeries) => {
  const n = targetSeries.length;
  const lastDataPoint = n > 0 ? targetSeries[n-1] : null;
  const newMoment = moment(dataPoint[apiXKey]);
  const newDateTimestamp = moment([ newMoment.year(), newMoment.month(), newMoment.date() ]).valueOf();
  const lastDateTimestamp = lastDataPoint ? lastDataPoint.x : null;
  const newY = dataPoint[apiYKey];

  if (newDateTimestamp && lastDateTimestamp && newDateTimestamp === lastDateTimestamp) {
    // merge
    mergeWithLastDataPoint(lastDataPoint, newY);
  } else {
    // add
    targetSeries.push({x: newDateTimestamp, y: newY, totalY: newY, count: 1});
  }
};

const mergeWithLastDataPoint = (lastDataPoint, newY) => {
  const { totalY, count } = lastDataPoint;
  // Running Mean
  const updatedTotalY = +(totalY + newY);
  const updatedCount = +(count + 1);
  const updatedY = (updatedTotalY / updatedCount).toFixed(2);
  lastDataPoint.y = parseFloat(updatedY);
  lastDataPoint.totalY = updatedTotalY;
  lastDataPoint.count = updatedCount;
};

const findIdealIntervalType = (dataSeriesRollup) => {
  for (let intervalType of intervalTypes) {
    if (dataSeriesRollup.hasOwnProperty(intervalType)) {
      const currentSeries = dataSeriesRollup[intervalType];
      if (currentSeries.length >= 5) {
        return intervalType;
      }
    }
  }

  // As last resort, return the last supported interval
  return intervalTypes[intervalTypes.length - 1];
};

const calcIdealIntervalCount = (intervalType, dataSeries) => {
  const n = dataSeries.length;
  const dataPointStartX = moment(dataSeries[0].x);
  const dataPointEndX = moment(dataSeries[n-1].x);
  const idealIntervalPoints = 10;
  const actualIntervalPoints = dataPointEndX.diff(dataPointStartX, intervalType + "s");
  if (actualIntervalPoints >= 15) {
    return Math.round(actualIntervalPoints / idealIntervalPoints);
  }

  return 1;
};

const getChartOptions = (intervalType, dataSeries) => {
  const chartOptions = {};
  chartOptions["interval"] = calcIdealIntervalCount(intervalType, dataSeries);
  chartOptions["xValueType"] = "dateTime";

  switch(intervalType) {
    case "year":
      chartOptions["valueFormatString"] = "YYYY";
      chartOptions["intervalType"] = "year";
      break;
    case "month":
      chartOptions["valueFormatString"] = "MMM YYYY";
      chartOptions["intervalType"] = "month";
      break;
    case "day":
      chartOptions["valueFormatString"] = "MMM D YYYY";
      chartOptions["intervalType"] = "day";
      break;
    default:
      chartOptions["valueFormatString"] = "MMM D YYYY";
      chartOptions["intervalType"] = "day";
      break;
  }

  return chartOptions;
}


export default {

  importRawDeliciousness(data, apiDataPointKeys) {
    const processedData = {};

    if (apiXKey !== apiDataPointKeys.xKey || apiYKey !== apiDataPointKeys.yKey) {
      updateApiKeys(apiDataPointKeys.xKey, apiDataPointKeys.yKey);
    }

    for (let fruitType of Object.keys(data)) {
      const rawDataSeries = data[fruitType];

      if (!rawDataSeries || rawDataSeries.length === 0) {
        continue;
      }

      const { durationSpanCount, durationSpanType } = getDurationSpan(rawDataSeries);
      const dataSeriesRollup = rollupDataSeriesData(rawDataSeries, durationSpanType);

      processedData[fruitType] = {
        metaData: {
          durationSpanCount,
          durationSpanType,
          rawDataPointCount: rawDataSeries.length,
          idealIntervalType: findIdealIntervalType(dataSeriesRollup),
          availableIntervalTypes: Object.keys(dataSeriesRollup),
        }
      };

      processedData[fruitType]["seriesData"] = {};
      const seriesDataObj = processedData[fruitType]["seriesData"];

      for (let intervalType of intervalTypes) {
        if (dataSeriesRollup.hasOwnProperty(intervalType)) {
          seriesDataObj[intervalType] = {
            chartOptions: getChartOptions(intervalType, dataSeriesRollup[intervalType]),
            chartData: dataSeriesRollup[intervalType],
          };
        }
      }

    }

    return processedData;
  },

};
