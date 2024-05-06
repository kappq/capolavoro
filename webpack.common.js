const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Capolavoro',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(csv|tsv)$/i,
        use: {
          loader: 'csv-loader',
          options: {
            header: true,
            skipEmptyLines: true,
          },
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
};

