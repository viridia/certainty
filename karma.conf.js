module.exports = function(config) {
  config.set({
    frameworks: [ 'mocha', 'browserify' ],
    preprocessors: {
      'test/**/*.js': [ 'browserify' ]
    },
    files: [
      'test/**/*.js'
    ],
    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd'
      }
    },
    reporters: [ 'mocha' ],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [ 'Chrome', 'PhantomJS', 'Firefox' ],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 20000,
    singleRun: true
  });
};
