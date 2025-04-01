import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

dotenv.config({ path: './.env' });

const babelLoader = {
	loader: 'babel-loader',
	options: {
		presets: [
			[
				'@babel/preset-env',
				{
					targets: { safari: '8' },
				},
			],
		],
	},
};

const config: webpack.Configuration = {
	target: ['web', 'es3'],
	entry: './src/main.tsx',
	output: {
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.json'],
		fullySpecified: false,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					babelLoader,
					{
						loader: 'ts-loader',
					},
				],
			},
			{
				test: /\.m?jsx?$/,
				use: [babelLoader],
			},
			{
				test: /\.png/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'assets/[name].[ext]',
						},
					},
				],
			},
		],
	},
	plugins: [
		new webpack.EnvironmentPlugin(['TMDB_ACCESS_TOKEN']),
		new HtmlWebpackPlugin({
			template: './templates/index.html',
		}),
	],
	performance: {
		hints: false,
		maxEntrypointSize: 2048000,
		maxAssetSize: 2048000,
	},
};

export default config;
