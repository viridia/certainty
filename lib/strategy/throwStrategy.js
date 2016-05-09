function ThrowStrategy() {}

ThrowStrategy.prototype.fail = function(msg) {
  throw new Error(msg);
}

module.exports = ThrowStrategy;
