const path = require('path');

// Extract
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // Set entry file
  entry: {
    main: './webpack-build.js'
  },
  // set output JS file
  output: {
    filename: 'main.js',
    path: path.join(__dirname, '/public/js')
  },

  module: {
    loaders: [
      // Processes Javascript from webpack-build.js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader' // & transpile
      },
      // Processes Sass from webpack-build.js
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style', // backup loader when not building .css file
          ['css', 'postcss', 'sass'] // processes sass into css with sass-loader
          // 'postcss-loader'
        )
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('../css/style.css') // outputs css to public directory (relative to output path)
  ]
};
