const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'client', 'src');

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

walkSync(targetDir, function(filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Replace exact rgb match with text-slate-200 for better readability
        content = content.replace(/text-\[rgb\(51,116,253\)\]/g, 'text-slate-200');
        
        // Also replace border colors if they use this raw RGB, though borders can be darker. Actually, let's leave borders alone or change them to border-blue-400/30.
        // Wait, the prompt asked to fix "the words are hard to see". So just text.
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated colors in ${filePath}`);
        }
    }
});
