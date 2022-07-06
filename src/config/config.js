import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCkTxakX_9nozk3IYpp0Dwg5Xxfq1oNcQA",
    authDomain: "todo-bf4f6.firebaseapp.com",
    databaseURL: "https://todo-bf4f6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "todo-bf4f6",
    storageBucket: "todo-bf4f6.appspot.com",
    messagingSenderId: "577155714691",
    appId: "1:577155714691:web:de1d0160d2eea5e24a15b6",
    measurementId: "G-YCP0CYFWDS"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

export {db}