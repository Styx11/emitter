module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './test/index.ts',
  output: {
    filename: 'index.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [/test/, /src/]
      }
    ]
  }
}