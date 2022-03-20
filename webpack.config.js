const path = require('path')
const nodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: {
    bot: './src/bot.ts',
    sync: './src/sync.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['babel-loader']
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      }
    ]
  },
  target: 'node',
  devtool: 'source-map',
  externals: [nodeExternals()],
  watchOptions: {
    ignored: ['**/dist', '**/node_modules'],
    poll: 1000
  },
  plugins: [new ForkTsCheckerWebpackPlugin()]
}
