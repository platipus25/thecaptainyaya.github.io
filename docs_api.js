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
async function initClient() {
	await gapi.client.init({
		apiKey: "AIzaSyBbOErwKsigaldMEcmsoNURF9DHED17p-0",
		clientId: "233676235337-e4k8et9oj9p8d4pq6i89kbiifn5hmqe3.apps.googleusercontent.com",
		discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
		scope: "https://www.googleapis.com/auth/drive.file"
	})
	// Listen for sign-in state changes.
	gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

	// Handle the initial sign-in state.
	updateSigninStatus();
	authorizeButton.onclick = handleAuthClick;
	signoutButton.onclick = handleSignoutClick;
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
async function createDoc() {
	if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
		alert("Please sign in to use the feature");
		window.location.reload(false);
	}
	
	//Searches for a folder to put the logs in. If none exist, it will create one
	let folderId;
	let response = null;
	try {
		response = await gapi.client.drive.files.list({
			"q": "name = 'Daily Logs' and mimeType = 'application/vnd.google-apps.folder'"
		})
	} catch(err){
		console.error("Execute error", err);
		return;
	}
	console.log("Response", response);
	if (response.result.files.length != 0) {
		folderId = response.result.files[0].id;
		console.log("i found it");
	} else {
		console.log("i didnt find it");
		let response1 = null;
		try {
			response1 = await gapi.client.drive.files.create({
				"mimeType": "application/vnd.google-apps.folder",
				"name": "Daily Logs"
			})
		} catch (err){
			console.error("Execute error", err);
			return;
		}
		folderId = response1.id;
	}
	console.log(folderId);
	
	//Creates the google doc
	const today = new Date();
	const date = (today.getFullYear() - Math.floor(today.getFullYear() / 100) * 100) + "." + (today.getMonth() + 1) + "." + today.getDate();
	const title = "Daily Log - " + date;
	let documentId;
	
	const searchQuery = "name = '" + title + "' and mimeType = 'application/vnd.google-apps.document' and '" + folderId + "' in parents";
	let response = null;
	try {
		response = gapi.client.drive.files.list({
			"q": searchQuery
		})
	} catch (err){
		console.error("Execute error", err);
		return;
	}
	console.log("Response", response);
	if (response.result.files.length != 0) {
		documentId = response.result.files[0].id;
		console.log("i found it");
	} else {
		console.log("i didnt find it");
		gapi.client.drive.files.create({
			"mimeType": "application/vnd.google-apps.document",
			"name": title
		}).then(response1 => {
			documentId = response1.id;
		}, err => {
			console.error("Execute error", err);
		});
	}
	const params = {"documentId": documentId};
	
	// Body of the request to batch update
	let updateRequest = {
		"requests": [
			{
				"insertText": {
					"text": "\n" + textarea.value.replace("\\", "\\\\").replace('"', '\\\"').replace("'", "\\\'"),
					"location": {
						"index": 1,
						"segmentId": ""
					}
				}
			}
		]
	};
	
	// Resets the textarea
	textarea.value = "";
	
	// Batch updates
	let response = null
	try{
		gapi.client.docs.documents.batchUpdate(params, updateRequest)
	} catch (err){
		console.error("Execute error", err);
		return;
	}
	if(response.result.error.message) {
		console.error("Error: " + response.result.error.message);
	}else {
		console.log("Document sucessfully batch updated");
	}
}
