// Gets all HTML elements
const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');
const textarea = document.getElementById('textarea');
const submitButton = document.getElementById('submit_button');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state listeners.
*/
function initClient() {
	gapi.client.init({
		apiKey: "AIzaSyBbOErwKsigaldMEcmsoNURF9DHED17p-0",
		clientId: "233676235337-e4k8et9oj9p8d4pq6i89kbiifn5hmqe3.apps.googleusercontent.com",
		discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
		scope: "https://www.googleapis.com/auth/drive.file"
	}).then(() => {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		updateSigninStatus();
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
	});
}

/**
*  Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus() {
	if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		textarea.style.display = 'block';
		submitButton.style.display = 'block';
	} else {
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
		textarea.style.display = 'none';
		submitButton.style.display = 'block';
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
* Creates a document with the log
*/
function createDoc() {
	if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
		alert("Please sign in to use the feature");
		window.location.reload(false);
	}
	
	//Searches for a folder to put the logs in. If none exist, it will create one
	let folderId;
	gapi.client.drive.files.list({
		"q": "name = 'Daily Logs' and mimeType = 'application/vnd.google-apps.folder'"
	}).then(response => {
		console.log("Response", response);
		try {
			folderId = response.files[0].id;
		} catch(error) {
			gapi.client.drive.files.create({
				"mimeType": "application/vnd.google-apps.folder",
				"name": "Daily Logs"
			}).then(response1 => {
				folderId = response1.id;
			}, err => {
				console.error("Execute error", err);
			});
		}
	}, err => { 
		console.error("Execute error", err);
	});
	console.log(folderId);
	
	//Creates the google doc
	let googleDoc = {"title": "title"};
	let today = new Date();
	let day = (today.getFullYear() - Math.floor(today.getFullYear() / 100) * 100) + "." + (today.getMonth() + 1) + "." + today.getDate();
	googleDoc.title = "Daily Log - " + day;
	gapi.client.docs.documents.create(googleDoc).then(response => {
		// Gets the document ID of the newley created document
		let googleDoc = response.result;
		let params = {"documentId": "id"};
		params.documentId = googleDoc.documentId;
		
		// Body of the request to batch update
		let updateRequest = {
			"requests": [
				{
					"insertText": {
						"text": "text",
						"location": {
							"index": 1,
							"segmentId": ""
						}
					}
				}
			]
		};
		
		// Sanatizes user input and adds it to the batch update
		let input = "\n" + textarea.value.replace("\\", "\\\\").replace('"', '\\\"').replace("'", "\\\'");
		updateRequest.requests[0].insertText.text = input;
		
		// Resets the textarea
		textarea.value = "";
		
		// Batch updates
		gapi.client.docs.documents.batchUpdate(params, updateRequest).then(response => {
			console.log("Document sucessfully batch updated");
		}, () => {
			console.log("Error: " + response.result.error.message);
		});
	}, response => {
		console.log('Error: ' + response.result.error.message);
	});
}
