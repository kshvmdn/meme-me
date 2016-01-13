#! /usr/bin/env node
"use strict";

const Promise = require('bluebird'); 
const request = require('request');
const open = require('open'); 
const chalk = require('chalk');

const subreddits = ['meme', 'fffffffuuuuuuuuuuuu', 'AdviceAnimals'];
var base = 'http://reddit.com/r/{}.json';

var getJSON = function(subreddit) {
	return new Promise(function(resolve, reject) {
		request(base.replace('{}', subreddit), function (error, response, body) {
			console.log(base.replace('{}', subreddit));
			if (error || response.statusCode != 200) reject();
			else resolve(JSON.parse(body));
		});
	});
}

var getMeme = function(json) {
	return new Promise(function(resolve, reject) {
		let posts = json.data.children
		var post = json.data.children[Math.floor(Math.random() * posts.length)].data

		// check if mod post
		while (post.distinguished != null) {
			post = json.data.children[Math.floor(Math.random() * posts.length)].data
		}
		console.log(post.url)
		resolve(post.url);
	});
}

var sr = subreddits[Math.floor(Math.random() * subreddits.length)]
getJSON(sr).then(function(response) {
	getMeme(response).then(function(url) {
		console.log("Loading meme from " + chalk.blue("/r/" + sr) + "...");
		open(url);
	}).catch(function(e){
		console.log('JSON parse error');
	});
}).catch(function(e){
	console.log('URL request error');
});
