#! /usr/bin/env node

const Promise = require('bluebird');
const request = require('request');
const open = require('open');
const chalk = require('chalk');
const ncp = require('copy-paste');

const subreddits = ['meme', 'memes', 'fffffffuuuuuuuuuuuu'];
const base = 'http://reddit.com';

const rndVal = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getJSON = (subreddit) => {
  return new Promise((resolve, reject) => {
    let url = `${base}/r/${subreddit}.json?limit=100`;
    request({
      url: url,
      json: true
    }, (error, response, body) => {
      if (error || response.statusCode != 200) {
        reject(new Error('Couldn\'t retrieve data.'));
      }

      resolve(body);
    });
  });
}

const getSubmission = (json) => {
  return new Promise((resolve, reject) => {
    let posts = json.data.children;
    let post;
    do {
      post = rndVal(posts).data;
    } while (post.distinguished !== null); // Verify submission isn't a self-post

    if (post.url === undefined || post.url === '') {
      reject(new Error('Couldn\'t find img/gif URL.'));
    }

    resolve(post);
  });
}

let subreddit = rndVal(subreddits);

getJSON(subreddit)
  .then((response) => getSubmission(response))
  .then((post) => {
    console.log(chalk.white(`Loading MEME from ${chalk.green('/r/' + subreddit)}...`));

    // Open submission URL, copy permalink to clipboard
    open(post.url);
    ncp.copy(`${base}${post.permalink}`);

    process.exit(0);
  })
  .catch((err) => {
    console.log(chalk.white(`${chalk.red('Oops!')} ${chalk.bold('MemeME')} failed, try again!`));
    process.exit(1);
  });
