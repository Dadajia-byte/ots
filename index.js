#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs')
// const crypto = require('crypto'); // node 内置模块
const { hideBin } = require('yargs/helpers');

// 获取文件的创建时间和最后修改时间
function getFileTimes(filePath) {
  const stats = fs.statSync(filePath);
  // 可能时区不对，需要转换为UTC+8
  const options = { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  const createdTime = new Date(stats.birthtime).toLocaleString('zh-CN', options).replace(/\//g, '-').replace(',', '');
  const modifiedTime = new Date(stats.mtime).toLocaleString('zh-CN', options).replace(/\//g, '-').replace(',', '');
  return { createdTime, modifiedTime };
}

// 生成Banner内容
function generateBanner(author, createdTime, modifiedTime, title) {
  return `---
title: ${title}
author: ${author}
created: ${createdTime}
last_modified: ${modifiedTime}
---
`;
}
/* // 解析现有的 Banner 内容
function parseBanner(content) {
  const bannerEndIndex = content.indexOf('---', 3) + 3;
  const bannerContent = content.substring(0, bannerEndIndex);
  const bannerLines = bannerContent.split('\n').filter(line => line.trim() !== '---');
  const banner = {};
  bannerLines.forEach(line => {
    const [key, value] = line.split(':').map(part => part.trim());
    banner[key] = value;
  });
  return banner;
}

// 计算内容的哈希值
function hashContent(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}
 */
// 读取文件内容并添加或更新Banner
function addOrUpdateBanner(filePath, author, action) {
  const { createdTime, modifiedTime } = getFileTimes(filePath);
  const banner = generateBanner(author, createdTime, modifiedTime, path.basename(filePath, '.md'));
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent;
  if (action === 'update' && content.startsWith('---')) {
    const preBanner = content.substring(0, content.indexOf('---', 3) + 3);
    if (banner !== preBanner) {
      const endOfBanner = content.indexOf('---', 3) + 2;
      newContent = banner + content.substring(endOfBanner);
    } else {
      console.log(`文章没有任何变化，不需要更新Banner。${filePath}`);
      return;
    }
  } else if (action === 'add' && !content.startsWith('---')) {
    newContent = banner + content;
  } else {
    console.log(`没有任何操作作用于${filePath}.`);
    return;
  }
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Banner ${action}操作已经成功被作用于 ${filePath}.`);
}

// 获取目录下所有Markdown文件，排除特定目录(目前只有node_modules)
function getMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules')) { // 排除node_modules目录
        results = results.concat(getMarkdownFiles(file));
      }
    } else if (file.endsWith('.md')) {
      results.push(file);
    }
  });
  return results;
}

// 定义添加Banner命令
yargs(hideBin(process.argv))
    /* 增加 */.command({
  command: 'add',
  describe: '添加Banner到Markdown文件',
  builder: {
    file: {
      alias: 'f',
      describe: '指定需要添加banner的文件路径',
      type: 'string',
    },
    all: {
      alias: 'A',
      describe: '作用于当前目录下的所有Markdown文件',
      type: 'boolean',
    },
    author: {
      alias: 'u',
      describe: '指定特定作者',
      type: 'string',
    }
  },
  handler(argv) {
    const author = argv.author || 'Dadajia'; // 默认都是Dadajia为作者
    if (argv.all) { // 全部文件
      const markdownFiles = getMarkdownFiles(__dirname);
      markdownFiles.forEach(filePath => {
        addOrUpdateBanner(filePath, author, 'add');
      });
    } else if (argv.file) {
      addOrUpdateBanner(argv.file, author, 'add');
    } else {
      console.error('请指定要增加banner的文件路径，或者输入 --all 作用于当前目录下的所有Markdown文件。');
      process.exit(1);
    }
  }
})
    /* 更新 */.command({
  command: 'update',
  describe: '更新Markdown文件中的Banner',
  builder: {
    file: {
      alias: 'f',
      describe: '指定需要更新banner的文件路径',
      type: 'string',
    },
    all: {
      alias: 'A',
      describe: '作用于当前目录下的所有Markdown文件',
      type: 'boolean',
    },
    author: {
      alias: 'u',
      describe: '指定特定作者',
      type: 'string',
    }
  },
  handler(argv) {
    const author = argv.author || 'Dadajia'; // 默认都是Dadajia为作者
    if (argv.all) { // 全部文件
      const markdownFiles = getMarkdownFiles(__dirname);
      markdownFiles.forEach(filePath => {
        addOrUpdateBanner(filePath, author, 'update');
      });
    } else if (argv.file) {
      addOrUpdateBanner(argv.file, author, 'update');
    } else {
      console.error('请指定要更新banner的文件路径，或者输入 --all 作用于当前目录下的所有Markdown文件。');
      process.exit(1);
    }
  }
})
  .demandCommand(1, '错误: 你必须提供一个有效的命令 (add 或 update)。')
  .usage('Usage: $0 <command> [options]')
  .help()
  .alias('help', 'h')
  .argv;;



