'use strict';
const path = require('path');
const fs = require('fs');

module.exports = appInfo => {
  const config = exports = {};

  exports.view = {
    cache: false,
  };

  exports.logview = {
    dir: path.join(appInfo.baseDir, 'logs'),
  };

  config.mysql = {
    // database configuration
    clients: {
      media_db: {
        // host
        host: '47.105.46.120',
        // port
        port: '3306',
        // username
        user: 'root',
        // password
        password: 'ycy6323892',
        // database
        database: 'media_db',
      },
      imdb: {
        // host
        host: '47.105.46.120',
        // port
        port: '3306',
        // username
        user: 'root',
        // password
        password: 'ycy6323892',
        // database
        database: 'imdb',
      }
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

/*  exports.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/flights-crawler',
      options: {
        useNewUrlParser: true,
        // user: 'flightsCrawler',
        // pass: 'ycy6323892',
      },
    },
  };*/

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


  return config;
};
