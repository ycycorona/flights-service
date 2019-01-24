'use strict';

// had enabled by egg
// exports.static = true;

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
}

exports.logview = {
  package: 'egg-logview',
  env: [ 'local' ],
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

