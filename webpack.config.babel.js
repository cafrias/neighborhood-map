/* jshint esversion:6 */

/*
This file contains configuration for Webpack bundler.
More information on: https://webpack.js.org/configuration/
 */

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const production = process.env.NODE_ENV == 'production';

var plugins = [
	new ExtractTextPlugin({
		filename: 'styles.css'
	}),
	new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}
	})
];

// IF IN PRODUCTION ____________________________________________________________
if(production) {
	plugins = plugins.concat([
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]);
}

var config = {
	entry: {
		app: ['./index.js', 'whatwg-fetch']
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
	devtool: production ? 'eval' : 'source-map',
	devServer: {
		contentBase: './public',
		colors: true,
		inline: true,
		host: '0.0.0.0'
	}
};

export default config;
