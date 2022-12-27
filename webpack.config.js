const path = require('path');

module.exports = [
    {
        entry: './src/app.js',
        mode: 'production',
        output: {
            filename: 'mraph.js',
            path: path.resolve(__dirname, 'dist'),
        },
    }, {
        entry: './src/app.js',
        mode: 'development',
        output: {
            filename: 'mraph.js',
            path: path.resolve(__dirname, 'test'),
        },
    }
];