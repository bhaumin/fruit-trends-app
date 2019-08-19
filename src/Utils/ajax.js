import DataUtils from './DataUtils';

// This component can query the backend API when needed

const fruits = [
  { id: 1, name: "Apples", types: [ "Fuji", "Gala", "Honeycrisp", "Red" ] },
  { id: 2, name: "Oranges", types: [ "Navel", "Mandarin", "Cuties" ] },
  { id: 3, name: "Pears", types: [ "White", "Brown" ] },
];

const fruitTypesDeliciousness = {
  "1": {
    "Fuji": [
      {x: 1522521000000, y: 2},
      {x: 1530383400000, y: 5},
      {x: 1538332200000, y: 4},
      {x: 1546281000000, y: 3},
      {x: 1554057000000, y: 1},
      {x: 1561919400000, y: 4},
    ],
    "Gala": [
      {x: 1548959400000, y: 5},
      {x: 1551378600000, y: 4},
      {x: 1554057000000, y: 4},
      {x: 1556649000000, y: 3},
      {x: 1559327400000, y: 4},
      {x: 1561919400000, y: 5},
    ],
    "Honeycrisp": [
      {x: 1548959400000, y: 2},
      {x: 1549218600000, y: 1},
      {x: 1549477800000, y: 3},
      {x: 1549737000000, y: 1},
      {x: 1549996200000, y: 2},
      {x: 1550255400000, y: 1},
    ],
    "Red": [
      {x: 1548959400000, y: 2},
      {x: 1549045800000, y: 1},
      {x: 1549132200000, y: 3},
      {x: 1549218600000, y: 1},
      {x: 1549305000000, y: 2},
      {x: 1549391400000, y: 1},
    ],
  },
  "2": {
    "Navel": [
      {x: 1554057000000, y: 2},
      {x: 1554143400000, y: 3},
    ],
    "Mandarin": [],
    "Cuties": [],
  },
  "3": {
    "White": [],
    "Brown": [],
  }
};


export default {
  fetchAllFruits() {
    return fruits;
  },

  fetchFruitTypeDeliciousness(fruitId) {
    try {
      if (!fruitTypesDeliciousness.hasOwnProperty(fruitId)) {
        throw new Error(`Cannot find data points for fruitId ${fruitId}`);
      }

      return {
        rawData: fruitTypesDeliciousness[fruitId],
        processedData: DataUtils.importRawDeliciousness(fruitTypesDeliciousness[fruitId]),
      };
    } catch(error) {
      console.error(error);
    }
  }
};
