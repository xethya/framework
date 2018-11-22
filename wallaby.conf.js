module.exports = function () {
  return {
    files: [
      'src/**/*.ts',
    ],

    tests: [
      'tests/**/*.spec.ts',
    ],

    env: {
      type: 'node',
      runner: 'node'  // or full path to any node executable
    }
  };
};
