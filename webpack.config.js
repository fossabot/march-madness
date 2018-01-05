/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { Proxy } = require('@domoinc/ryuu-proxy');
const manifest = require('./manifest.json');

module.exports = (env) => {
  const proxy = new Proxy(manifest);

  const postcssPlugins = [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ];

  if (env.prod) {
    postcssPlugins.push(cssnano({
      mergeRules: false,
      zindex: false,
      reduceIdents: false,
      mergeIdents: false,
      safe: true,
    }));
  }

  return {

    // where's the main js file
    entry: path.join(__dirname, 'src', 'index'),

    // where to put bundled files
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
      new CopyWebpackPlugin([
        { from: 'assets/**/*' },
      ]),
    ],

    module: {
      // Tells Webpack how to load other file extensions other than .js
      rules: [

        // runs any Sass or CSS file through these style loaders
        {
          test: /\.(scss|sass|css)$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
            {
              // adds vendor prefixes to css
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: postcssPlugins,
              },
            },
          ],
        },

        // Runs JS through Babel enabling the use of ES6+ syntax
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
            },
          },
        },

        { test: /\.(png|jpg)$/, loader: 'url-loader' },
      ],
    },

    // create source map for easier debugging during development
    devtool: 'source-map',

    // dev server config
    devServer: {
      publicPath: '/dist/',
      hot: false,
      inline: true,
      noInfo: true,

      // local proxy for Domo App /data requests
      before: app => app.use(proxy.express()),
    },
  };
};
