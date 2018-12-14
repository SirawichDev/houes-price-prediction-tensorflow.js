const fs = require('fs');
const _ = require('lodash');
const shuffler = require('shuffle-seed');

reVokeColumn = (data, colName) => {
  const headers = _.first(data);
  //   console.log(headers);
  const indexes = _.map(colName, column => headers.indexOf(column));
  //   console.log('indexes', indexes);
  const getter = _.map(data, row => _.pullAt(row, indexes));
  //   console.log('getter', getter);
  return getter;
};

module.exports = function CSVLoader(
  filename,
  {
    dataCol = [],
    labelCol = [],
    converters = {},
    shuffle = false,
    splitTest = false
  }
) {
  let data = fs.readFileSync(filename, { encoding: 'utf-8' });
  data = _.map(data.split('\n'), d => d.split(','));
  data = _.dropRightWhile(data, val => _.isEqual(val, ['']));
  const headers = _.first(data);

  data = _.map(data, (row, index) => {
    if (index === 0) {
      return row;
    }
    return _.map(row, (element, index) => {
      if (converters[headers[index]]) {
        const converted = converters[headers[index]](element);
        return _.isNaN(converted) ? element : converted;
      }

      const result = parseFloat(element.replace('"', ''));
      return _.isNaN(result) ? element : result;
    });
  });

  let labels = reVokeColumn(data, labelCol);
  //   console.log('labels', labels);
  data = reVokeColumn(data, dataCol);
  //   console.log('data', data);
  data.shift();
  labels.shift();

  if (shuffle) {
    data = shuffler.shuffle(data, 'miew');
    labels = shuffler.shuffle(labels, 'miew');
  }

  if (splitTest) {
    const trainSize = _.isNumber(splitTest)
      ? splitTest
      : Math.floor(data.length / 2);

    return {
      features: data.slice(trainSize),
      labels: labels.slice(trainSize),
      testLatLong: data.slice(0, trainSize),
      testPrice: labels.slice(0, trainSize)
    };
  } else {
    return { features: data, labels };
  }
};
