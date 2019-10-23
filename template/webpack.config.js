const autoprefixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [{
    entry: [
      './css/app.scss',
      './js/app.js'
    ],
    output: {
      // This is necessary for webpack to compile
      // But we never use style-bundle.js
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'bundle.css',
              }
            },
            { loader: 'extract-loader' },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer()]
              }
            },            
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['./node_modules']
              }
            }
          ]
        },
        {
          test: /^(?!.*\.test\.js$).*\.js$/,
          use: {
            loader: 'babel-loader',
          },
          exclude: /node_modules/
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
            },
          },
        },
        {
          test: /\.(png|gif|jpg|svg|ico)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]",
            },
          },
        },                
      ]
    },
    optimization: {
      // Remove comments from the minified output
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    },    
  }];