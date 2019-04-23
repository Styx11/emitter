module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    libraryTarget: 'umd',
    filename: 'index.js',
    path: __dirname + '/release'
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: /src/
      }
    ]
  }
}