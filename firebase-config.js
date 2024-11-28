// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDq2FgcO_-UH2diQzpx2kkCVjxjNdNHUEA",
  authDomain: "hype-toptrend.firebaseapp.com",
  projectId: "hype-toptrend",
  storageBucket: "hype-toptrend.firebasestorage.app",
  messagingSenderId: "627497438083",
  appId: "1:627497438083:web:473f92e35de26a894c04b6"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Reference Firebase services
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();