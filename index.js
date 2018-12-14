//ตำนวนด้วย  tsjs-node
require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const CSVLoader = require('./get_csv');
let { features, labels, testLatLong, testPrice } = CSVLoader(
  'kc_house_data.csv',
  {
    shuffle: true,
    splitTest: 10,
    dataCol: ['lat', 'long'],
    labelCol: ['price']
  }
);
console.log(testLatLong, 'and', testPrice);
