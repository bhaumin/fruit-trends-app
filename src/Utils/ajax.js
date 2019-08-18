// This component can query the backend instead when necessary

const fruits = [
  { id: 1, name: "Apples", types: [ "Fuji", "Gala", "Honeycrisp", "Red" ] },
  { id: 2, name: "Oranges", types: [ "Navel", "Mandarin", "Cuties" ] },
  { id: 3, name: "Pears", types: [ "White", "Brown" ] },
];

const fruitTypesDeliciousness = {
  "1": {
    "Fuji": [{ x: new Date(2018, 3), y: 2.0}, { x: new Date(2018, 6), y: 5.0}, { x: new Date(2018, 9), y: 4.0}, { x: new Date(2019, 0), y: 3.0}, { x: new Date(2019, 3), y: 1.0}, { x: new Date(2019, 6), y: 4.0}, ],
    "Gala": [{ x: new Date(2019, 1), y: 5.0}, { x: new Date(2019, 2), y: 4.0}, { x: new Date(2019, 3), y: 4.0}, { x: new Date(2019, 4), y: 3.0}, { x: new Date(2019, 5), y: 4.0}, { x: new Date(2019, 6), y: 5.0}, ],
    "Honeycrisp": [{ x: new Date(2019, 1, 1), y: 2.0}, { x: new Date(2019, 1, 4), y: 1.0}, { x: new Date(2019, 1, 7), y: 3.0}, { x: new Date(2019, 1, 10), y: 1.0}, { x: new Date(2019, 1, 13), y: 2.0}, { x: new Date(2019, 1, 16), y: 1.0}, ],
    "Red": [{ x: new Date(2019, 1, 1), y: 2.0}, { x: new Date(2019, 1, 2), y: 1.0}, { x: new Date(2019, 1, 3), y: 3.0}, { x: new Date(2019, 1, 4), y: 1.0}, { x: new Date(2019, 1, 5), y: 2.0}, { x: new Date(2019, 1, 6), y: 1.0}, ],
  },
  "2": {
    "Navel": [{ x: new Date(2019, 3, 1), y: 2.0}, { x: new Date(2019, 3, 2), y: 3.0}, ],
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

      return fruitTypesDeliciousness[fruitId];
    } catch(error) {
      console.error(error);
    }
  }
};
