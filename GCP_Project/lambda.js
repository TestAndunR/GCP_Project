let AWS = require('aws-sdk');
let google = require('googleapis').google;
const pubsub = google.pubsub('v1');
let _auth = require('./Authorizer');

const datastore = google.datastore('v1');
exports.handler = function (event, context, callback) {
	pubsub.projects.topics.subscriptions.list({
		topic: `projects/${process.env.GCLOUD_PROJECT_ID}/topics/incoming`,
		pageSize: 10
	})
		.then(response => {
			console.log(response.data);  // successful response
			/*
			response.data = {
				"subscriptions": [
					"projects/<project>/subscriptions/<subscription-1>",
					"projects/<project>/subscriptions/<subscription-2>",
					...
				]
			}
			*/
		})
		.catch(err => {
			console.log(err, err.stack); // an error occurred
		});
	pubsub.projects.topics.publish({
		topic: `projects/${process.env.GCLOUD_PROJECT_ID}/topics/incoming`,
		resource: {
			messages: [{ data: `SGVsbG8gV29ybGQ=`, attributes: {} }]
		}
	})
		.then(response => {
			console.log(response.data);           // successful response
			/*
			response.data = {
				"messageIds": [
					"<numeric-message-id>"
				]
			}
			*/
		})
		.catch(err => {
			console.log(err, err.stack); // an error occurred
		});
	pubsub.projects.subscriptions.create({
		name: `projects/${process.env.GCLOUD_PROJECT_ID}/subscriptions/subscription2`,
		resource: {
			"topic": `projects/${process.env.GCLOUD_PROJECT_ID}/topics/incoming`,
			"retainAckedMessages": false,
			"messageRetentionDuration": "86400s",
			"ackDeadlineSeconds": 10
		}
	})
		.then(response => {
			console.log(response.data);           // successful response
			/*
			response.data = {
				"name": "projects/<project>/subscriptions/<subscription>",
				"topic": "projects/<project>/topics/<topic>",
				"pushConfig": {
					"pushEndpoint": "<push-url>"
				},
				"ackDeadlineSeconds": 10,
				"messageRetentionDuration": "600s"
			}
			*/
		})
		.catch(err => {
			console.log(err, err.stack); // an error occurred
		});
	pubsub.projects.subscriptions.delete({
		subscription: `projects/${process.env.GCLOUD_PROJECT_ID}/subscriptions/subscription2`,
	})
		.then(response => {
			console.log(response.data);           // successful response
			/*
			response.data = {}
			*/
		})
		.catch(err => {
			console.log(err, err.stack); // an error occurred
		});



	callback(null, 'Successfully executed');
}