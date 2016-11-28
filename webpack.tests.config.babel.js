/* jshint esversion:6 */

import path from 'path';
import webpack from 'webpack';

const hostname = 'localhost',
			port = '8090';

const plugins = [
	new webpack.DefinePlugin({
		__TESTING__: true
	})
];

const config = {
	entry: 'mocha!./test/index.js',
	output: {
		filename: 'test.build.js',
		path: path.join(__dirname, '/test')
	},
	module: {
		noParse: [
			/node_modules\/sinon/
		],
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel-loader'],
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: 'null-loader',
				exclude: /public/
			},
			{
				test: /(\.jpg|\.jpeg|\.png|\.gif)$/,
				loader: 'null-loader'
			}
		]
	},
	plugins,
	devServer: {
		host: hostname,
		port: port,
		inline: true,
		contentBase: './test'
	}
};

export default config;
