// This component can query the backend instead when necessary

const fruits = [
  { id: 1, name: "Apples", types: [ "Fuji", "Gala", "Honeycrisp" ] },
  { id: 2, name: "Oranges", types: [ "Navel", "Mandarin", "Cuties" ] },
  { id: 3, name: "Pears", types: [ "White", "Brown" ] },
];


// We could've included the following with the main fruits array.
// But, since datapoints could be big for some fruits, we plan
// for it being made available separately for each fruit
const fruitTypesDeliciousness = {
  "1": {
    "Fuji": [{ x: new Date(2019, 1), y: 2.0}, { x: new Date(2019, 2), y: 5.0}, { x: new Date(2019, 3), y: 4.0}, { x: new Date(2019, 4), y: 3.0}, { x: new Date(2019, 5), y: 1.0}, { x: new Date(2019, 6), y: 5.0},],
    "Gala": [{ x: new Date(2019, 1), y: 5.0}, { x: new Date(2019, 2), y: 4.0}, { x: new Date(2019, 3), y: 4.0}, { x: new Date(2019, 4), y: 3.0}, { x: new Date(2019, 5), y: 4.0}, { x: new Date(2019, 6), y: 5.0},],
    "Honeycrisp": [{ x: new Date(2019, 1), y: 2.0}, { x: new Date(2019, 2), y: 1.0}, { x: new Date(2019, 3), y: 3.0}, { x: new Date(2019, 4), y: 1.0}, { x: new Date(2019, 5), y: 2.0}, { x: new Date(2019, 6), y: 1.0},],
  },
  "2": {
    "Navel": [],
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
