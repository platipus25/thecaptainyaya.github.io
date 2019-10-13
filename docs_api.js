      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var authorizeButton = document.getElementById('authorize_button');
      var signoutButton = document.getElementById('signout_button');

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
          discoveryDocs: DISCOVERY_DOCS,
          scope: "https://www.googleapis.com/auth/drive.file"
        }).then(function() {
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
          printDocTitle();
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
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }
      /**
       * Prints the title of a sample doc:
       * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
       */
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
    }