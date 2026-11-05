// webpack.config.js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
