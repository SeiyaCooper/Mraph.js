const path = require('path');
const fs = require('fs');

function getFiles(path) {
    const files = [];
    
    (function step(path) {
        fs.readdirSync(path).forEach(f => {
            const url = path + '/' + f;
            if (fs.statSync(url).isDirectory()) {
                step(url);
            } else {
                files.push(url);
            }
        })
    })(path);
    
    return files;
}

module.exports = [
    {
        entry: getFiles('./src'),
        mode: 'production',
        output: {
            filename: 'mraph.js',
            path: path.resolve(__dirname, 'dist'),
        },
    }, {
        entry: getFiles('./src'),
        mode: 'development',
        output: {
            filename: 'mraph.js',
            path: path.resolve(__dirname, 'test'),
        },
    }
];