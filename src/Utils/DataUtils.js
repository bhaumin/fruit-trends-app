import moment from 'moment';

// Add/keep things in the decreasing order in intervals
const intervals = [ "year", "month", "day" ];

const getDurationSpan = (dataSeries) => {
  let durationSpanCount = 0;
  let durationSpanType = null;

  if (dataSeries && dataSeries.length > 0) {
    const firstDate = moment(dataSeries[0].x);
    const lastDate = moment(dataSeries[dataSeries.length - 1].x);
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
  const newMoment = moment(dataPoint.x);
  const newYearTimestamp = moment([ newMoment.year(), 0 ]).valueOf();
  const lastYearTimestamp = n > 0 ? targetSeries[n-1].x : null;

  if (newYearTimestamp && lastYearTimestamp && newYearTimestamp === lastYearTimestamp) {
    // merge
    targetSeries[n-1].y = ((targetSeries[n-1].y + dataPoint.y) / (n+1)).toFixed(1);
  } else {
    // add
    targetSeries.push({x: newYearTimestamp, y: dataPoint.y});
  }
};

const addToMonthlySeries = (dataPoint, targetSeries) => {
  const n = targetSeries.length;
  const newMoment = moment(dataPoint.x);
  const newMonthTimestamp = moment([ newMoment.year(), newMoment.month() ]).valueOf();
  const lastMonthTimestamp = n > 0 ? targetSeries[n-1].x : null;

  if (newMonthTimestamp && lastMonthTimestamp && newMonthTimestamp === lastMonthTimestamp) {
    // merge
    targetSeries[n-1].y = ((targetSeries[n-1].y + dataPoint.y) / (n+1)).toFixed(1);
  } else {
    // add
    targetSeries.push({x: newMonthTimestamp, y: dataPoint.y});
  }
};

const addToDailySeries = (dataPoint, targetSeries) => {
  const n = targetSeries.length;
  const newMoment = moment(dataPoint.x);
  const newDateTimestamp = moment([ newMoment.year(), newMoment.month(), newMoment.date() ]).valueOf();
  const lastDateTimestamp = n > 0 ? targetSeries[n-1].x : null;

  if (newDateTimestamp && lastDateTimestamp && newDateTimestamp === lastDateTimestamp) {
    // merge
    targetSeries[n-1].y = ((targetSeries[n-1].y + dataPoint.y) / (n+1)).toFixed(1);
  } else {
    // add
    targetSeries.push({x: newDateTimestamp, y: dataPoint.y});
  }
};

const findIdealIntervalType = (dataSeriesRollup) => {
  for (let interval of intervals) {
    if (dataSeriesRollup.hasOwnProperty(interval)) {
      const currentSeries = dataSeriesRollup[interval];
      if (currentSeries.length >= 5) {
        return interval;
      }
    }
  }

  // As last resort, return the last supported interval
  return intervals[intervals.length - 1];
};

const calcIdealIntervalCount = (dataSeries) => {
  const maxXDataPointsCount = 10;
  if (dataSeries.length >= 15) {
    return Math.round(dataSeries.length / maxXDataPointsCount);
  }

  return 1;
};

const getChartOptions = (interval, dataSeries) => {
  const chartOptions = {};
  chartOptions["interval"] = calcIdealIntervalCount(dataSeries);
  chartOptions["xValueType"] = "dateTime";

  switch(interval) {
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

  importRawDeliciousness(data) {
    const processedData = {};

    for (let fruitType of Object.keys(data)) {
      const rawDataSeries = data[fruitType];
      const { durationSpanCount, durationSpanType } = getDurationSpan(rawDataSeries);
      const dataSeriesRollup = rollupDataSeriesData(rawDataSeries, durationSpanType);

      processedData[fruitType] = {
        metaData: {
          durationSpanCount,
          durationSpanType,
          rawDataPointCount: rawDataSeries.length,
          idealInterval: findIdealIntervalType(dataSeriesRollup),
          availableIntervals: Object.keys(dataSeriesRollup),
        }
      };

      processedData[fruitType]["seriesData"] = {};
      const seriesDataObj = processedData[fruitType]["seriesData"];

      for (let interval of intervals) {
        if (dataSeriesRollup.hasOwnProperty(interval)) {
          seriesDataObj[interval] = {
            chartOptions: getChartOptions(interval, dataSeriesRollup[interval]),
            chartData: dataSeriesRollup[interval],
          };
        }
      }

    }

    return processedData;
  },

};
