const firebaseConfig = {
    apiKey: "AIzaSyBFInqG5gbQjjrTFPUGb3U9a9EzHQYiNEg",
    authDomain: "bible-read-ranting-labu.firebaseapp.com",
    projectId: "bible-read-ranting-labu",
    storageBucket: "bible-read-ranting-labu.firebasestorage.app",
    messagingSenderId: "476957450367",
    appId: "1:476957450367:web:a74307146c107a53b89f4a"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
 
