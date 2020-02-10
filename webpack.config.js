const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'PersistenceRenderer.js',
        library: 'PersistenceRenderer',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.join(__dirname, './src')
        ],

        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }],
    },

    plugins: [
        new ForkTsCheckerWebpackPlugin(),
    ],

    externals: [
        {
            nouislider : 'noUiSlider',
            'vtk.js': 'vtk.js'
        },
    ]
};
