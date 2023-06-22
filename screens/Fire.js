// import firebase from "firebase";
// import "@firebase/firestore";

// const firebaseConfig = {
//     apiKey: "AIzaSyDxuuNBsAKvDDPd9kIjrIZ8X_Cxv4i0LLY",
//     authDomain: "yttodoapp.firebaseapp.com",
//     databaseURL: "https://yttodoapp.firebaseio.com",
//     projectId: "yttodoapp",
//     storageBucket: "yttodoapp.appspot.com",
//     messagingSenderId: "796524377832",
//     appId: "1:796524377832:web:4b8bf9078787f863003b5d"
// };

// export default class Fire {
//     constructor(callback) {
//         this.init(callback);
//     }

//     init(callback) {
//         if (!firebase.apps.length) {
//             firebase.initializeApp(firebaseConfig);
//         }

//         firebase.auth().onAuthStateChanged(user => {
//             if (user) {
//                 callback(null, user);
//             } else {
//                 firebase
//                     .auth()
//                     .signInAnonymously()
//                     .catch(error => {
//                         callback(error);
//                     });
//             }
//         });
//     }

//     getLists(callback) {
//         let ref = this.ref.orderBy("name");

//         this.unsubscribe = ref.onSnapshot(snapshot => {
//             lists = [];

//             snapshot.forEach(doc => {
//                 lists.push({ id: doc.id, ...doc.data() });
//             });

//             callback(lists);
//         });
//     }

//     addList(list) {
//         let ref = this.ref;

//         ref.add(list);
//     }

//     updateList(list) {
//         let ref = this.ref;

//         ref.doc(list.id).update(list);
//     }

//     get userId() {
//         return firebase.auth().currentUser.uid;
//     }

//     get ref() {
//         return firebase
//             .firestore()
//             .collection("users")
//             .doc(this.userId)
//             .collection("lists");
//     }

//     detach() {
//         this.unsubscribe();
//     }
// }


