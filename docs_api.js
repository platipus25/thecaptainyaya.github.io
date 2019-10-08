$(()=>{
	/* Array of API discovery doc URLs for APIs used by the quickstart */
	const DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];
	const authorizeButton = $('#authorize_button');
	const signoutButton = $('#signout_button');
	const textarea = $('#textarea');
	const submitButton = $('#submitCode');
	
	/* Array of API discovery doc URLs for APIs used by the quickstart */
	var DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];
	
	/* Authorization scopes required by the API; multiple scopes can be included, separated by spaces. */
	var authorizeButton = document.getElementById('authorize_button');
	var signoutButton = document.getElementById('signout_button');
	
	/**
	*  On load, called to load the auth2 library and API client library.
	*/
	function handleClientLoad() {
		gapi.load('client:auth2', initClient);
	}
	
	/**
	*  Sign in/out the user upon button click.
	*/
	function handleAuthClick(event) {
		gapi.auth2.getAuthInstance().signIn();
	}
	
	function handleSignoutClick(event) {
		gapi.auth2.getAuthInstance().signOut();
	}
	
	/**
	*  Initializes the API client library and sets up sign-in state
	*  listeners.
	*/
	function initClient() {
		gapi.client.init({
			apiKey: "AIzaSyAh7uT_LoX_U0LxWpEw0jGLCxTpUMQSIOs",
			clientId: "233676235337-e4k8et9oj9p8d4pq6i89kbiifn5hmqe3.apps.googleusercontent.com",
			discoveryDocs: DISCOVERY_DOCS,
			scope: "https://www.googleapis.com/auth/drive.file"
		}).then(() => {
				scope: SCOPES
		}).then(function() {
			/* Listen for sign-in state changes. */
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
			/* Handle the initial sign-in state. */
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
			authorizeButton.hide();
			signoutButton.show();
			textarea.show();
			submitButton.show();
		} else {
			authorizeButton.show();
			signoutButton.hide();
		}
	}
	
	function submitCode() {
		if (!isSignedIn) {
			return;
		}
		let code = textarea.innerHTML;
		textarea.innerHTML = "";
		
	}
});
	/**
	* Prints the title of a sample doc:
	* https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
	
	function printDocTitle() {
		gapi.client.docs.documents.get({
			documentId: '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE'
		}).then(function(response) {
			var doc = response.result;
		var title = doc.title;
			appendPre('Document "' + title + '" successfully found.\n');
		}, function(response) {
			appendPre('Error: ' + response.result.error.message);
		});
	}*/
