/* eslint-env node, mocha */
/* global Promise */
var ensure = require('../index.js').ensure;

function assertRejects(promise, done) {
  promise.then(
    function () {
      throw new Error('rejection expected.');
    },
    function (reason) {
      done();
      return reason;
    }
  );
}

if (typeof Promise !== 'undefined') {
  describe('ensure.promise', function () {
    describe('.succeeds()', function () {
      it('should succeed when promise is resolved', function() {
        return ensure(Promise.resolve(true)).succeeds();
      });

      it('should fail when promise is rejected', function(done) {
        assertRejects(ensure(Promise.reject(true)).succeeds(), done);
      });
    });

    describe('.fails()', function () {
      it('should succeed when promise is rejected', function() {
        return ensure(Promise.reject(new Error('some error'))).fails();
      });

      it('should fail when promise succeeds', function(done) {
        assertRejects(ensure(Promise.resolve(1)).fails(), done);
      });
    });

    describe('.succeedsWith()', function () {
      it('should succeed when promise succeeds with the correct value', function() {
        return ensure(Promise.resolve(true)).succeedsWith(true);
      });

      it('should fail when the promise is rejected', function(done) {
        assertRejects(ensure(Promise.reject(true)).succeedsWith(true), done)
      });

      it('should fail when the promise succeeds with the wrong value', function(done) {
        assertRejects(ensure(Promise.reject(false)).succeedsWith(true), done)
      });
    });

    describe('.failsWith()', function () {
      it('should succeed when the promise rejects with the expected value', function() {
        return ensure(Promise.reject('some error')).failsWith('some error');
      });

      it('should fail when the promise succeeds', function(done) {
        assertRejects(ensure(Promise.resolve(1)).failsWith(1), done);
      });

      it('should fail when the promise rejects with the wrong value', function(done) {
        assertRejects(ensure(Promise.reject(2)).failsWith(1), done);
      });
    });

    describe('.eventually()', function () {
      describe('.isTrue()', function () {
        it('should succeed when the promise resolves to true', function() {
          return ensure(Promise.resolve(true)).eventually().isTrue();
        });

        it('should fail when the promise resolves to a value other than true', function(done) {
          assertRejects(ensure(Promise.resolve(false)).eventually().isTrue(), done);
        });

        it('should fail when the promise rejects', function(done) {
          assertRejects(ensure(Promise.reject(true)).eventually().isTrue(), done);
        });

        it('should succeed even when the promise is not resolved immediately', function() {
          // Try it with a promise that doesn't immediately resolve.
          var promise = new Promise(function(onFulfilled, _onRejected) {
            setTimeout(function() { onFulfilled(true); }, 10);
          });
          return ensure(promise).eventually().isTrue();
        });

      });

      describe('.equals()', function () {
        it('should succeed when the resolved value is equal', function() {
          return ensure(Promise.resolve(7)).eventually().equals(7);
        });

        it('should fail when the resolved value is not equal', function(done) {
          assertRejects(ensure(Promise.resolve(6)).eventually().equals(7), done);
        });
      });

      describe('.contains()', function () {
        it('should succeed when the resolved value contains the expected item', function() {
          return ensure(Promise.resolve([7])).eventually().contains(7);
        });
      });
    });
  });
}
