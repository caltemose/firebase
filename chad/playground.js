(function(window, document, firebase) {

    var SIGN_IN = 'Sign in';
    var SIGN_OUT = 'Sign out';

    var signInButton, results, databaseElement;

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

        firebase.auth().getRedirectResult().then(function(result) {
            console.log('getRedirectResult success');
            console.log(result);
            if (result.user)
                results.user = result.user;
            if (result.credential)
                results.token = result.credential.accessToken;
        }).catch(function(error) {
            console.log('getRedirectResult error');
            console.log(error);
            results = {};
        });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('onAuthStateChanged authed');
                console.log(user);
                databaseElement.style.display = 'block';
                signInButton.textContent = SIGN_OUT;
            } else {
                console.log('onAuthStateChanged unauthed');
                databaseElement.style.display = 'none';
                signInButton.textContent = SIGN_IN;
            }
            signInButton.disabled = false;
        });

        signInButton.addEventListener('click', toggleSignIn, false);
    }

    window.onload = function() {
        initApp();
    };

})(window, document, firebase);
