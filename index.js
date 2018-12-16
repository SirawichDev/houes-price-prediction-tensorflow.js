require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const CSVLoader = require('./get_csv');

const knn = (features, labels, predictPoint, k) => {
  console.log(object);
  return (
    features
      .sub(predictPoint)
      .pow(2)
      .sum(1)
      .pow(1.5)
      .expandDims(1)
      .concat(labels, 1)
      .unstack()
      .sort((a, b) => (a.get(0) > b.get(0) ? 1 : -1))
      .slice(0, k)
      .reduce((acc, pair) => acc + pair.get(1), 0) / k
  );
};

let { features, labels, testLatLong, testPrice } = CSVLoader(
  'kc_house_data.csv',
  {
    shuffle: true,
    splitTest: 10,
    dataCol: ['lat', 'long'],
    labelCol: ['price']
  }
);

features = tf.tensor(features);
labels = tf.tensor(labels);

const result = knn(features, labels, tf.tensor(testLatLong[0]), 10);
console.log('Guess: ', result, testPrice[0][0]);
