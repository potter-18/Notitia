importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCQkTH0pCy8tRqGAALFq7wyLfdyHiTeBVw",
  authDomain: "push-notitia.firebaseapp.com",
  projectId: "push-notitia",
  storageBucket: "push-notitia.appspot.com",
  messagingSenderId: "166862486537",
  appId: "1:166862486537:web:c0a339b74ff455ef534cd8",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = { body: payload.notification.body };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
