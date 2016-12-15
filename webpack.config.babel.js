/* jshint esversion:6 */

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const production = process.env.NODE_ENV === 'production';

const plugins = [
	new ExtractTextPlugin({
		filename: 'styles.css'
	}),
	new webpack.DefinePlugin({
		__TESTING__: false,
		__DEVELOPMENT__: !production
	})
];

const config = {
	entry: {
		app: ['./index.js']
	},
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'bundle.js'
	},
	plugins: plugins,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				enforce: 'pre',
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: 'css-loader'	
				})
			}
		]
	},
	devServer: {
		contentBase: './public',
		colors: true,
		inline: true,
		host: '0.0.0.0'
	}
};

export default config;
