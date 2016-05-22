/* eslint-env node, mocha */
var ensure = require('../index').ensure;
var ProxyBase = require('../lib/subject/proxy');

function TestProxy() {
  ProxyBase.call(this);
}
TestProxy.prototype = Object.create(ProxyBase.prototype);
TestProxy.prototype.constructor = ProxyBase;

TestProxy.prototype.invoke = function(fieldName) {
  return fieldName;
}

describe('ProxyBase', function () {
  var proxy = new TestProxy();
  it('correctly proxies', function() {
    ensure(proxy.isTrue()).equals('isTrue');
  });
});
