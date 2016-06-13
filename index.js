#! /usr/bin/env node
"use strict";

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

const getPost = (json) => {
  return new Promise((resolve, reject) => {
    let posts = json.data.children;

    // Verify that the post isn't a self post (i.e. not a meme)
    let post;
    do {
      post = rndVal(posts).data;
    } while (post.distinguished !== null);

    if (post.url === undefined || post.url === '') {
      reject(new Error('Couldn\'t find img/gif URL.'));
    }
    resolve(post);
  });
}

let subreddit = rndVal(subreddits);

return getJSON(subreddit)
  .then((response) => getPost(response))
  .then((post) => {
    console.log(chalk.white(`Loading post from ${chalk.green('/r/' + subreddit)}...`));
    open(post.url); // Open submission URL
    ncp.copy(`${base}${post.permalink}`); // Copy thread permalink to clipboard
    process.exit(0);
  })
  .catch((err) => {
    console.log(chalk.white(`${chalk.red('Oops!')} ${chalk.bold('MemeME')} failed, try again!`));
    process.exit(1);
  });
