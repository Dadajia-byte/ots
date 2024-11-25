#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs')
const axios = require('axios');
const { hideBin } = require('yargs/helpers');

// 获取当前日期
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return {
        date: `${year}-${month}-${day}`,
        datetime: `${year}-${month}-${day} ${hours}:${minutes}`
    };
}

// 生成日报模板内容
function generateReportTemplate(date, datetime, author) {
    return `---
title: ${date}
author: ${author}
created: ${datetime}
last_modified: ${datetime}
---
## 日报
**时间**：${date} **汇报人**：${author}
### 今日工作
1. 
2. 
3. 
### 遇到的问题
1. 
2. 
3. 
### 今日总结
### 明日规划
1. 
2. 
3. 
`;
}

// 保存日报模板到文件
function saveReportTemplate(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`日报模板已生成并保存到 ${filePath}`);
}

// 调用openapi根据今日工作和遇到的问题生成总结
async function generateSummary(todayWork, todayProblems) {
    const apiKey = 'YOUR_OPENAI_API_KEY'; // 替换为你的openapikey
    const prompt = `根据以下内容生成一个今日总结，要求适当脱离内容：
        今日工作:
        ${todayWork}
        遇到的问题:
        ${todayProblems}
        今日总结:;
        `
    try {
        const res = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt,
            max_tokens: 150,
            n: 1,
            stop: null,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return res.date.choices[0].text.trim();;
    } catch (e) {
        console.error('出错啦', e);
        return '生成总结失败';
    }
}

// 读取日报文件内容
function readReportFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const todayWorkMatch = content.match(/### 今日工作\n([\s\S]*?)\n### 遇到的问题/);
    const todayProblemsMatch = content.match(/### 遇到的问题\n([\s\S]*?)\n### 今日总结/);

    const todayWork = todayWorkMatch ? todayWorkMatch[1].trim() : '';
    const todayProblems = todayProblemsMatch ? todayProblemsMatch[1].trim() : '';

    return { todayWork, todayProblems };
}

// 更新日报文件内容
function updateReportFile(filePath, summary) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/### 今日总结\n[\s\S]*?\n### 明日规划/, `### 今日总结\n${summary}\n### 明日规划`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`日报文件已更新并保存到 ${filePath}`);
}

// 主函数
async function main() {
    const argv = yargs(hideBin(process.argv))
        .command('g', '生成日报模板', (yargs) => {
            yargs.option('author', {
                alias: 'a',
                type: 'string',
                description: '作者名称',
                default: '陈安舒'
            });
        }, (argv) => {
            const { date, datetime } = getCurrentDate();
            const author = argv.author;
            const reportContent = generateReportTemplate(date, datetime, author);
            const filePath = path.join(__dirname, 'hk报告', `${date}.md`); // 这里修改了保存的文件路径，hk是我自己根目录下的文件夹
            saveReportTemplate(filePath, reportContent);
        })
        .command('s', '生成今日总结并插入原文', (yargs) => {
            yargs.option('file', {
                alias: 'f',
                type: 'string',
                description: '指定的日报文件路径',
                demandOption: true
            });
        }, async (argv) => {
            const { file } = argv;
            const { todayWork, todayProblems } = readReportFile(file);
            if (todayWork && todayProblems) {
                const summary = await generateSummary(todayWork, todayProblems);
                updateReportFile(file, summary);
            } else {
                console.error('无法读取今日工作内容或遇到的问题');
            }
        })
        .help()
        .alias('help', 'h')
        .argv;
}

main();