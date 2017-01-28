module.exports = {
  context: __dirname + '/scripts',
  entry: './src/index.js',
  output: {
    path: __dirname + '/scripts/dist',
    filename: 'onsen-ex.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query:{
          presets: [
            ["env", {
              "targets": {
                "chrome": 52
              },
              "loose": true
            }]
          ],
          plugins: [
            "transform-class-properties"
          ]
        }
      }
    ]
  }
};
