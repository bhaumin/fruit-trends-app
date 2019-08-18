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
    "Fuji": [],
    "Gala": [],
    "Honeycrisp": [],
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
