import React from 'react';

const FruitTypeList = props => {
  const { fruit, currentFruitType, deliciousnessData, handleClick } = props;

  const getClassesToUse = (fruitType) => {
    const selectedRowClasses = [ "table-primary" ];
    return fruitType === currentFruitType ? selectedRowClasses.join(" ") : "";
  }

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
                <td>{props.deliciousnessData[fruitType].length} data point(s), covering a span of &lt;duration&gt;</td>
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
