import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

class FirebaseAuthBackend {
    constructor(firebaseConfig) {
        if (firebaseConfig) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            // firebase.auth().onAuthStateChanged(user => {
            //   if (user) {
            //     localStorage.setItem("authUser", JSON.stringify(user));
            //   } else {
            //     localStorage.removeItem("authUser");
            //   }
            // });
        }
    }

    /**
     * Registers the user with given details
     */
    registerUser = (email, password) => {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(
                    user => {
                        resolve(firebase.auth().currentUser);
                    },
                    error => {
                        reject(this._handleError(error));
                    }
                );
        });
    };

    /**
     * Registers the user with given details
     */
    editProfileAPI = (email, password) => {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(
                    user => {
                        resolve(firebase.auth().currentUser);
                    },
                    error => {
                        reject(this._handleError(error));
                    }
                );
        });
    };

    /**
     * Login user with given details
     */
    loginUser = (email, password) => {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(
                    user => {
                        resolve(firebase.auth().currentUser);
                    },
                    error => {
                        reject(this._handleError(error));
                    }
                );
        });
    };

    /**
     * forget Password user with given details
     */
    forgetPassword = email => {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    reject(this._handleError(error));
                });
        });
    };

    /**
     * Logout the user
     */
    logout = () => {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    reject(this._handleError(error));
                });
        });
    };

    setLoggeedInUser = user => {
        localStorage.setItem("authUser", JSON.stringify(user));
    };

    /**
     * Returns the authenticated user
     */
    getAuthenticatedUser = () => {
        if (!localStorage.getItem("authUser")) return null;
        return JSON.parse(localStorage.getItem("authUser"));
    };

    /**
     * Handle the error
     * @param {*} error
     */
    _handleError(error) {
        // var errorCode = error.code;
        var errorMessage = error.message;
        return errorMessage;
    }
}

let _fireBaseBackend = null;

/**
 * Returns the firebase backend
 */
const firebaseConfig = {
    apiKey: "AIzaSyCiHzkzrehtcOBaCRHvfI9Tx3qIhS6lrLM",
    authDomain: "kaotech-914d6.firebaseapp.com",
    projectId: "kaotech-914d6",
    storageBucket: "kaotech-914d6.appspot.com",
    messagingSenderId: "420949702003",
    appId: "1:420949702003:web:4886b19627bf17c9e28106",
    measurementId: "G-YV8DKEBJPF"
};


/**
 * Initilize the backend
 * @param {*} config
 */
const initBackendAPI = () => {
    if (!_fireBaseBackend) {
        _fireBaseBackend = new FirebaseAuthBackend(firebaseConfig);
    }
    return _fireBaseBackend;
};

/**
 * Returns the backend
 */
const getBackendAPI = () => {
    return initBackendAPI(firebaseConfig)
};

export { initBackendAPI, getBackendAPI };
