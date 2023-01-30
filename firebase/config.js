import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDr-_JUpONcz8wpkN-__BjZKETclPW3xgE",
  authDomain: "fir-chat-app-e9f1b.firebaseapp.com",
  projectId: "fir-chat-app-e9f1b",
  storageBucket: "fir-chat-app-e9f1b.appspot.com",
  messagingSenderId: "353964897833",
  appId: "1:353964897833:web:a9241919ad1d27ac684e38",
  measurementId: "G-SG0LWKFQVE",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === "localhost") {
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;
