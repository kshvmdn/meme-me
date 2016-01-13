#! /usr/bin/env node
"use strict";

const Promise = require('bluebird'); 
const request = require('request');
const open = require('open'); 
const chalk = require('chalk');
const ncp = require('copy-paste');

const subreddits = ['meme', 'fffffffuuuuuuuuuuuu'];
var base = 'http://reddit.com';

var rndval = function(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

var getJSON = function(subreddit) {
	return new Promise(function(resolve, reject) {
		request(base.replace('{}', subreddit), function (error, response, body) {
			// console.log(base.replace('{}', subreddit));
			if (error || response.statusCode != 200) reject();
			resolve(JSON.parse(body));
		});
	});
}

var getPost = function(json) {
	return new Promise(function(resolve, reject) {
		let posts = json.data.children
		
		var post = rndval(posts).data
		// verify that post isn't text post
		while (post.distinguished != null) {
			post = rndval(posts).data
		}
		// console.log(post.url)
		if (post.url == undefined || post.url == '' || post.url == null) reject()
		resolve(post.url);
	});
}

var sr = rndval(subreddits);

getJSON(sr).then(function(response) {
	return getPost(response)
}).then(function(post){
	console.log( chalk.white('Opening post from ' + chalk.green('/r/' + sr) + '...' ) );
	open(post.url); ncp.copy(base + post.permalink);
	process.exit(0);
}).catch(function(err) {
	console.log( chalk.white( chalk.red('Oops! ') +  chalk.bold('MemeME') + ' failed, try again!') );
	process.exit(1);
});
