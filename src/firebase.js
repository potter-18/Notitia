import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage, deleteToken } from 'firebase/messaging';
import { getDatabase, ref, set, remove, query} from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth";

// Add Congif data provided in firebase project creation.
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  };


const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const database = getDatabase();


const auth = getAuth();
const provider = new GoogleAuthProvider();

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
        vapidKey: "",  // Add VAP Id provided at the time of FCM registration
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);
          set(ref(database, "/tokens/" + auth.currentUser.uid), {
            name: auth.currentUser.displayName,
            token: currentToken
          });
        } else {
          console.log("Can not get token");
        }
      });
    }
  });
};

// Add VAP Id provided at the time of FCM registration

export const unsubscribeButton = () => {
  deleteToken(messaging, {
    vapidKey: "",
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
