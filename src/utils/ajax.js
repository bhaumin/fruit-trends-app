import dataUtils from './dataUtils';

// Update the apiHost and apiEndPoint to point to actual backend
const apiHost = "http://localhost:3000";

// Update the following object to reflect the x and y keys coming from backend
const apiDataPointKeys = { xKey: "x", yKey: "y" };

export default {
  async fetchAllFruits() {
    try {
      const apiEndPoint = apiHost + "/mockApi/fruits.json";
      const response = await fetch(apiEndPoint);
      const responseJson = await response.json();
      return responseJson;
    } catch(error) {
      console.error(error);
    }
  },

  async fetchFruitDeliciousnessData(fruitId) {
    try {
      const apiEndPoint = apiHost + "/mockApi/fruitDeliciousness.json";
      const response = await fetch(apiEndPoint);
      const responseJson = await response.json();

      if (!responseJson.hasOwnProperty(fruitId)) {
        throw new Error(`Cannot find data points for fruitId ${fruitId}`);
      }

      return dataUtils.importRawDeliciousness(responseJson[fruitId], apiDataPointKeys);
    } catch(error) {
      console.error(error);
    }
  }
};
