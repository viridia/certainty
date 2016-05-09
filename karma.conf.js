module.exports = function(config) {
  config.set({
    frameworks: [ 'mocha', 'browserify' ],
    preprocessors: {
      'test/**/*.js': [ 'browserify' ]
    },
    files: [
      'test/**/*.js'
    ],
    reporters: [ 'progress' ],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [ 'Chrome' ],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 20000,
    singleRun: true
  });
};
