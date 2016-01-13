#! /usr/bin/env node
"use strict";

const Promise = require('bluebird'); 
const request = require('request');
const open = require('open'); 
const chalk = require('chalk');
const ncp = require('copy-paste');

var subreddits = ['meme', 'memes', 'fffffffuuuuuuuuuuuu'];
var base = 'http://reddit.com';

var rndval = function(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

var getJSON = function(subreddit) {
	return new Promise(function(resolve, reject) {
		request(base + '/r/' + subreddit + '.json', function (error, response, body) {
			if (error || response.statusCode != 200) 
				reject('JSON request failed');
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

		if (post.url == undefined || post.url == '' || post.url == null) 
			reject(new Error('No img URL in post'));
		resolve(post);
	});
}

let sr = rndval(subreddits);

getJSON(sr).then(function(response) { 
	return getPost(response) 
}).then(function(post){
	console.log( chalk.white('Loading post from ' + chalk.green('/r/' + sr) + '...' ) );
	// open img url, copy thread permalink to clipboard
	open(post.url); ncp.copy(base + post.permalink);
	process.exit(0);
}).catch(function(err) {
	console.log( chalk.white( chalk.red('Oops! ') +  chalk.bold('MemeME') + ' failed, try again!') );
	process.exit(1);
});
