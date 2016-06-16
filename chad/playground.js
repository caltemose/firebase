(function(window, document, firebase) {

    // --------------------------------------------------------------- //
    // AUTHENTICATION STUFF
    // --------------------------------------------------------------- //

    var SIGN_IN = 'Sign in';
    var SIGN_OUT = 'Sign out';

    var signInButton, results, databaseElement, daysList, userEl;

    function toggleSignIn() {
        if (!firebase.auth().currentUser) {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            provider.addScope('https://www.googleapis.com/auth/userinfo.email');
            firebase.auth().signInWithRedirect(provider);
        } else {
            firebase.auth().signOut();
        }
        signInButton.disabled = true;
    }

    function initApp() {
        databaseElement = document.getElementById('database');
        databaseElement.style.display = 'none';
        signInButton = document.getElementById('signIn');
        results = {};
        daysList = document.getElementById('days');
        userEl = document.getElementById('user');

        firebase.auth().getRedirectResult().then(function(result) {
            // console.log('getRedirectResult success');
            // console.log(result);
            if (result.user)
                results.user = result.user;
            if (result.credential)
                results.token = result.credential.accessToken;
        }).catch(function(error) {
            // console.log('getRedirectResult error');
            // console.log(error);
            results = {};
        });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // console.log('onAuthStateChanged authed');
                // console.log(user);
                databaseElement.style.display = 'block';
                signInButton.textContent = SIGN_OUT;
                startDatabaseView();
            } else {
                // console.log('onAuthStateChanged unauthed');
                databaseElement.style.display = 'none';
                signInButton.textContent = SIGN_IN;
            }
            signInButton.disabled = false;
        });

        signInButton.addEventListener('click', toggleSignIn, false);
    }

    // --------------------------------------------------------------- //
    // DATABASE READ/WRITE
    // --------------------------------------------------------------- //

    function startDatabaseView () {
        days.innerHTML = '';
        var daysRef = firebase.database().ref('days');
        daysRef.on('child_added', function(data) {
            var day = jade.templates.day(data.val());
            daysList.innerHTML += day;
        });

        // usersList.innerHTML = '';
        var userId = firebase.auth().currentUser.uid;
        // var userRef = firebase.database().ref('/users/' + userId);
        // firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        firebase.database().ref('/users/' + userId).once('value').then(function (data) {
            console.log(data.val());
            var user = jade.templates.user(data.val());
            userEl.innerHTML += user;
        });
        // userRef.on('child_added', function (data) {
            // console.log(data.val());
            // var user = jade.templates.user(data.val());
            // usersList.innerHTML += user;
        // });
    }

    // --------------------------------------------------------------- //
    // INITIALIZATION
    // --------------------------------------------------------------- //

    window.onload = function() {
        initApp();
    };

})(window, document, firebase);
