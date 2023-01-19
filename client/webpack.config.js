const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  entry: path.join(__dirname, "index.js"),
  context: path.resolve(__dirname, "./assets"),
  output: {
    path: path.join(__dirname, "../server/public"),
    filename: "bundle.js",
  },
  mode: "development",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[id].css",
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        REACT_APP_WEATHER_API_KEY: JSON.stringify(
          process.env.REACT_APP_WEATHER_API_KEY
        ),
        REACT_APP_ESRI_API_KEY: JSON.stringify(
          process.env.REACT_APP_ESRI_API_KEY
        ),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      // this rule handles images
      {
        test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
        use: "file-loader",
      },

      // the following 3 rules handle font extraction
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
      },
      {
        test: /\.otf(\?.*)?$/,
        use: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "../server/public"),
  },
};
