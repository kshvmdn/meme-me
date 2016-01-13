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
	getMeme(response).then(function(url) {
		console.log("Opening meme from " + chalk.blue("/r/" + sr) + "...");
		open(url);
	}).catch(function(e){
		console.log('JSON parse error');
	});
}).catch(function(e){
	console.log('URL request error');
});
