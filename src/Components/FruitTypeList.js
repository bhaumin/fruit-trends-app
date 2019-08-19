import React from 'react';

const FruitTypeList = props => {
  const { fruit, currentFruitType, deliciousnessData, handleFruitTypeClick } = props;

  const getClassesToUse = (fruitType) => {
    const defaultRowClasses = [ "table-row" ];
    const selectedRowClasses = defaultRowClasses.concat("table-primary");
    return fruitType === currentFruitType ? selectedRowClasses.join(" ") : defaultRowClasses.join(" ");
  };

  const getRowText = (metaData) => {
    if (!metaData) {
      return "";
    }

    const { rawDataPointCount, durationSpanCount, durationSpanType } = metaData;

    const dataPointsText = rawDataPointCount > 0 ? "data points" : "data point";
    let rowText = `${rawDataPointCount} ${dataPointsText}`;

    if (durationSpanType) {
      const durationSpanTypeText = durationSpanType + (durationSpanCount > 1 ? "s" : "");
      rowText += `, covering a span of ${durationSpanCount} ${durationSpanTypeText}`;
    }

    return rowText;
  };


  return (
    <div className="table-container">
      <h3>Fruit: {fruit.name}</h3>
      <p className="text-muted">{fruit.types.length} total types of {fruit.name}</p>
      <br />
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col" className="col-types">Types</th>
            <th scope="col" className="col-summary">"Deliciousness"</th>
          </tr>
        </thead>
        <tbody>
          {fruit.types && fruit.types.map(fruitType =>
            <tr key={fruitType} className={getClassesToUse(fruitType)} onClick={() => handleFruitTypeClick(fruitType)}>
              <td className="col-types">{fruitType}</td>
              {deliciousnessData && deliciousnessData.hasOwnProperty(fruitType) ? (
                <td className="col-summary">
                  {getRowText(deliciousnessData[fruitType].metaData)}
                </td>
              ) : (
                <td className="col-summary">No data points</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

};

export default FruitTypeList;
