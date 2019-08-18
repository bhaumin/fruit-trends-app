import * as fruits from '../data/fruits.json';

function getAllFruits() {
  return fruits;
}


export default () => ({
  fruits: getAllFruits()
});
