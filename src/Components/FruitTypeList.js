import React from 'react';
import moment from 'moment';

const FruitTypeList = props => {
  const { fruit, currentFruitType, deliciousnessData, handleClick } = props;

  const getClassesToUse = (fruitType) => {
    const selectedRowClasses = [ "table-primary" ];
    return fruitType === currentFruitType ? selectedRowClasses.join(" ") : "";
  };

  const getDuration = (data) => {
    let durationCount = 0;
    let durationType = null;

    if (data && data.length > 0) {
      const firstDate = moment(data[0].x);
      const lastDate = moment(data[data.length - 1].x);
      const diff = lastDate.diff(firstDate);
      const dur = moment.duration(diff);

      if (dur.asYears() >= 1) {
        durationCount = Math.floor(dur.asYears());
        durationType = "year";
      } else if (dur.asMonths() >= 1) {
        durationCount = Math.floor(dur.asMonths());
        durationType = "month";
      } else if (dur.asWeeks() >= 1) {
        durationCount = Math.floor(dur.asWeeks());
        durationType = "week";
      } else {
        durationCount = Math.floor(dur.asDays());
        durationType = "day";
      }

      durationCount++;

      if (durationCount > 1) {
        durationType += "s";
      }
    }

    return {durationCount, durationType};
  };

  const getRowText = (data) => {
    if (!data) {
      return "";
    }

    const dataPointsText = data.length > 0 ? "data points" : "data point";
    let rowText = `${data.length} ${dataPointsText}`;

    const {durationCount, durationType} = getDuration(data);

    if (durationType) {
      rowText += `, covering a span of ${durationCount} ${durationType}`
    }

    return rowText;
  };


  return (
    <div className="fruit-types-table-container">
      <h3>Fruit: {fruit.name}</h3>
      <p class="text-muted">{fruit.types.length} total types of {fruit.name}</p>
      <br />
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Types</th>
            <th scope="col">"Deliciousness"</th>
          </tr>
        </thead>
        <tbody>
          {fruit.types && fruit.types.map(fruitType =>
            <tr key={fruitType} className={getClassesToUse(fruitType)} onClick={() => handleClick(fruitType)}>
              <td>{fruitType}</td>
              {deliciousnessData && deliciousnessData.hasOwnProperty(fruitType) ? (
                <td>
                  {/* {deliciousnessData[fruitType].length} data point(s), covering a span of &lt;duration&gt; */}
                  {getRowText(deliciousnessData[fruitType])}
                </td>
              ) : (
                <td>No data points</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

};

export default FruitTypeList;
