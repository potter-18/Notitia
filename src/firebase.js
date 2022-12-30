import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage, deleteToken } from 'firebase/messaging';
import { getDatabase, ref, set, remove, query, onValue, push} from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDrHXIF6tg-3u142utCjmy0IfK3SH-xJkc",
    authDomain: "tally-notitia.firebaseapp.com",
    projectId: "tally-notitia",
    storageBucket: "tally-notitia.appspot.com",
    messagingSenderId: "286442771525",
    appId: "1:286442771525:web:609302b89b5ab25d89bf2c",
  };


const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const database = getDatabase();




const auth = getAuth();
const provider = new GoogleAuthProvider();

export let token = ""


export const signIn = () => {
  signInWithPopup(auth, provider)
    .then(() => {
      console.log("Hello (:-");
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
}

export const signOff = () => {
  signOut(auth)
  .then(() => {
    console.log("Successfully Signed Out!")
  })
  .catch(() => {
  });
}

export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-push-notification-scope',
        });
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};

export const subscribeButton = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      getToken(messaging, {
        vapidKey:
          "BBhiEzNEIZhoe0st_ngva0ADh-SEVaaUb1QiDJVqqvhdrI3eJkh76QMgKt8-cFpJk_rIG4WQ8k8fHTk2LNLi6rE",
      }).then((currentToken) => {
        if (currentToken) {
          token = currentToken.slice()
          console.log("currentToken: ", currentToken);
          set(ref(database, "/tokens/" + auth.currentUser.uid), {
            name: auth.currentUser.displayName,
            uid: auth.currentUser.uid,
            token: currentToken,
            accessToken: auth.currentUser.accessToken
          });
          const postListRef = ref(database, "/notifications");
          const newPostRef = push(postListRef);
          set(newPostRef, {
            token: currentToken
          });
        } else {
          console.log("Can not get token");
        }
      });
    }
  });
};


export const unsubscribeButton = () => {
  deleteToken(messaging, {
    vapidKey:
      "BBhiEzNEIZhoe0st_ngva0ADh-SEVaaUb1QiDJVqqvhdrI3eJkh76QMgKt8-cFpJk_rIG4WQ8k8fHTk2LNLi6rE",
  })
  .then(() => {
    const queryConstraints = query(
      ref(database, "/tokens/" + auth.currentUser.uid)
    );
    remove(queryConstraints).then((snapshot) => {
      console.log("Removed Successfully (:-");
    });
  })
  .catch((err) => console.log("Error Deleting Token"));
};

export const onForegroundMessage = () =>
new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));



export const allids = () => {
  onValue(ref(database, '/notifications/{notificationId}'), (snapshot) => {
    console.log(snapshot)
    // ...
  }, {
    onlyOnce: true
  });
}