module.exports = {
  context: __dirname + '/src/scripts',
  entry: {
    'onsen-ex': './index.js',
    'html5ize': './html5ize.js'
  },
  output: {
    path: __dirname + '/dist/scripts',
    filename: "[name].js",
    chunkFilename: "[id].js"
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
