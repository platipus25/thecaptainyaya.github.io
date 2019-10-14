// Gets the sign in/out button
const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
	gapi.client.init({
		apiKey: "AIzaSyAh7uT_LoX_U0LxWpEw0jGLCxTpUMQSIOs",
		clientId: "233676235337-e4k8et9oj9p8d4pq6i89kbiifn5hmqe3.apps.googleusercontent.com",
		discoveryDocs: ['https://docs.googleapis.com/$discovery/rest?version=v1'],
		scope: "https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.file"
	}).then(() => {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
	});
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		createDoc();
	} else {
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
	}
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
	let pre = document.getElementById('content');
	let textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}

/**
* Creates a document with the log
*/
function createDoc() {
	// Parses a variable from the template.js file
	let googleDoc = {"title": "title"};
	let today = new Date();
	googleDoc.title = "Daily Log - " + Math.floor(today.getFullYear() / 100) + "." + (today.getMonth() + 1) + "." + today.getDate();
	gapi.client.docs.documents.create(googleDoc).then(response => {
		let googleDoc = response.result;
		let title = googleDoc.title;
		let updateRequest = {
			"requests": [
				{
					"insertText": {
						"text": "hello world",
						"location": {
							"index": 1,
							"segmentId": ""
						}
					}
				}
			]
		};
		gapi.client.docs.documents.batchUpdate(updateRequest);
		console.log("Successfully created " + googleDoc.title + ".");
	}, response => {
		console.log('Error: ' + response.result.error.message);
	});
}