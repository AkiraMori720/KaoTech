import firebase, {auth, firestore, storage} from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const TBL_KAOTECH = "kaotech";
export const TBL_POLICES = "polices";
export const TBL_GOVERNMENTS = "governments";
export const TBL_DRIVERS = "drivers";

export const DB_ACTION_ADD = 'add';
export const DB_ACTION_UPDATE = 'update';
export const DB_ACTION_DELETE = 'delete';

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
    loginUser = (phone) => {
        const appVerifier = window.recaptchaVerifier;
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signInWithPhoneNumber(phone, appVerifier)
                .then(
                    confirmationResult => {
                        window.confirmationResult = confirmationResult;
                        resolve(true);
                    },
                    error => {
                        console.log('user error', error);
                        alert('Invalid Phone Number');
                        //reject(this._handleError(error));
                    }
                );
        });
    };

    createUser = (userInfo) => {
        return new Promise((resolve, reject) => {
            firestore()
                .collection(this.TBL_USER)
                .add(userInfo)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                })
        })
    };

    deleteUser = (id) => {
        return new Promise((resolve, reject) => {
            firestore()
                .collection(this.TBL_USER)
                .doc(id)
                .delete()
                .then(() => {
                    console.log('delete user on doc success');
                })
                .catch((err) => {
                    console.log('delete user on doc error', err)
                });

            auth().currentUser.delete()
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err)
                });
        })
    };

    getUser = (id) => {
        return new Promise((resolve, reject) => {
            firebase.firestore()
                .collection(this.TBL_USER)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        if (doc.data().userId === id) {
                            const user = {
                                id: doc.id,
                                ...doc.data()
                            }
                            resolve(user);
                        }
                    })
                    resolve('no exist');
                })
                .catch(err => {
                    reject(err)
                })
        })
    };

    getData = (kind = '') => {
        return new Promise((resolve, reject) => {
            firebase.firestore()
                .collection(kind)
                .get()
                .then(snapshot => {
                    var data = [];
                    snapshot.forEach(doc => {
                        var obj = doc.data();
                        Object.assign(obj, {id: doc.id});
                        data.push(obj);
                    })
                    console.log('getData : ' + kind + ' Data: ', data);
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    };

    setData = (kind = '', act, item) => {
        return new Promise((resolve, reject) => {
            if (act === DB_ACTION_ADD) {
                firebase.firestore()
                    .collection(kind)
                    .add(item)
                    .then((res) => {
                        let itemWithID = {...item, id: res.id};
                        firebase.firestore()
                            .collection(kind)
                            .doc(res.id)
                            .update(itemWithID)
                            .then((response) => {
                                resolve(itemWithID)
                            })
                            .catch((err) => {
                                reject(err);
                            })
                    })
                    .catch(err => {
                        reject(err);
                    })
            } else if (act === DB_ACTION_UPDATE) {
                firebase.firestore()
                    .collection(kind)
                    .doc(item.id)
                    .update(item)
                    .then(() => {
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    })
            } else if (act === DB_ACTION_DELETE) {
                firebase.firestore()
                    .collection(kind)
                    .doc(item.id)
                    .delete()
                    .then(() => {
                        console.log(kind, act)
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    })
            }
        })
    };

    getRole = async (phone_number, passcode) => {
        // Kaotech
        const kaotechs = await firebase.firestore()
            .collection(TBL_KAOTECH)
            .get();

        let role = null;
        kaotechs.forEach(k => {
            if (k.data().phone_number === phone_number && k.data().passcode === passcode) {
                role = 'admin';
            }
        });
        if (role) {
            return role;
        }

        // Government
        const governments = await firebase.firestore()
            .collection(TBL_GOVERNMENTS)
            .get();
        governments.forEach(k => {
            if (k.data().phone_number === phone_number && k.data().passcode === passcode) {
                role = 'government';
            }
        });
        if (role) {
            return role;
        }

        // Police
        const polices = await firebase.firestore()
            .collection(TBL_POLICES)
            .get();
        polices.forEach(k => {
            if (k.data().phone_number === phone_number && k.data().passcode === passcode) {
                role = 'police';
            }
        });
        if (role) {
            return role;
        }

        return null;
    }
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
    };

    uploadMedia = (type, path) => {
        const milliSeconds = Date.now();
        return new Promise((resolve, reject) => {

            let ref = storage().ref(`${type}_${milliSeconds}`);

            ref.put(path)
                .then(async (res) => {
                    const downloadURL = await ref.getDownloadURL();
                    resolve(downloadURL);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    };
}

let _fireBaseBackend = null;

/**
 * Returns the firebase backend
 */
const firebaseConfig = {
    apiKey: "AIzaSyDxZ0qrWBRaC5Lb4IieW-pN0f0PpEGqlj4",
    authDomain: "islamik-by-kaotech.firebaseapp.com",
    databaseURL: "https://islamik-by-kaotech.firebaseio.com",
    projectId: "islamik-by-kaotech",
    storageBucket: "islamik-by-kaotech.appspot.com",
    messagingSenderId: "413068111620",
    appId: "1:413068111620:web:320abdf30e18d1e540ea51",
    measurementId: "G-YRZ4DGJWTK"
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

export {initBackendAPI, getBackendAPI};
