const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  plugins: [new MiniCSSExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
});
