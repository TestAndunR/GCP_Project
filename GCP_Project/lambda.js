let AWS = require('aws-sdk');
let _auth = require('./Authorizer');
let google = require('googleapis').google;
const pubsub = google.pubsub('v1');
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


	callback(null, 'Successfully executed');
}