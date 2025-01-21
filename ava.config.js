module.exports = {
    files: [
      '**/*.ava.spec.js', // Your test file pattern, can match .ts or .js
    ],
    extensions: ['js'],
    require: ['@babel/register'],  // Register Babel for on-the-fly transpilation
    environmentVariables: {
      NODE_ENV: 'test',
    },
    concurrency: 1
  };
  