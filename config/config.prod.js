'use strict';

module.exports = appInfo => {
  const config = exports = {};
  exports.mongoose = {
    client: {
      url: 'mongodb://47.105.46.120:27017/flights-crawler',
      options: {
        useNewUrlParser: true,
        user: 'flightsCrawler',
        pass: 'ycy6323892',
      },
    },
  };
  config.test = 'test';
  return config;
};
