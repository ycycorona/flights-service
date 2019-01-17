'use strict';

// had enabled by egg
// exports.static = true;
exports.passportLocal = {
  enable: true,
  package: 'egg-passport-local',
};

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.logview = {
  package: 'egg-logview',
  env: [ 'local' ],
};

exports.passport = {
  enable: true,
  package: 'egg-passport',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

