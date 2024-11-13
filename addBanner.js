const fs = require('fs');
const path = require('path');

// 获取文件的创建时间和最后修改时间
function getFileTimes(filePath) {
    const stats = fs.statSync(filePath);
    const createdTime = new Date(stats.birthtime).toISOString().replace('T', ' ').substring(0, 16);
    const modifiedTime = new Date(stats.mtime).toISOString().replace('T', ' ').substring(0, 16);
    return { createdTime, modifiedTime };
}

// 生成Banner内容
function generateBanner(author, createdTime, modifiedTime) {
    return `---
title: 登录鉴权
author: ${author}
created: ${createdTime}
last_modified: ${modifiedTime}
---
`;
}

// 读取文件内容并添加或更新Banner
function addOrUpdateBanner(filePath, author) {
    const { createdTime, modifiedTime } = getFileTimes(filePath);
    const banner = generateBanner(author, createdTime, modifiedTime);

    const content = fs.readFileSync(filePath, 'utf-8');
    let newContent;
    if (content.startsWith('---')) {
        const endOfBanner = content.indexOf('---', 3) + 3;
        newContent = banner + content.substring(endOfBanner);
    } else {
        newContent = banner + content;
    }
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Banner added or updated successfully for ${filePath}.`);
}

// 获取目录下所有Markdown文件
function getMarkdownFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getMarkdownFiles(file));
        } else if (file.endsWith('.md')) {
            results.push(file);
        }
    });
    return results;
}

// 主函数
function main() {
    const author = 'Dadajia'; // 替换为作者名字
    const markdownFiles = getMarkdownFiles(__dirname);
    markdownFiles.forEach(filePath => {
        addOrUpdateBanner(filePath, author);
    });
}

main();