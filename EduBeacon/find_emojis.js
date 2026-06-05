const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'client', 'src');

const emojiRegex = /[\p{Emoji_Presentation}\u{FE0F}]/gu;

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

const results = {};

walkSync(targetDir, function(filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            const matches = line.match(emojiRegex);
            if (matches) {
                // filter out ascii numbers/letters that might be caught
                const actualEmojis = matches.filter(m => !/^[0-9A-Za-z#*]$/.test(m));
                if (actualEmojis.length > 0) {
                    if (!results[filePath]) results[filePath] = [];
                    results[filePath].push({ line: index + 1, emojis: actualEmojis.join(''), content: line.trim() });
                }
            }
        });
    }
});

for (const file in results) {
    console.log(`\nFile: ${path.relative(__dirname, file)}`);
    results[file].forEach(res => {
         console.log(`  Line ${res.line}: ${res.emojis} - ${res.content}`);
    });
}
