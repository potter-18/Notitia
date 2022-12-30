import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import { onForegroundMessage, unsubscribeButton, signIn, signOff, subscribeButton, allids } from './firebase';

const baseURL = "https://fcm.googleapis.com/fcm/send";


export default function App() {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'key=AAAAQrFR1EU:APA91bEWVAggsr-qPaqFa_a-ticGg1c38xS1EuIXF3Xn7c59SnW2tYUUpW0eL_VlS201aUVhi2-DQBpgehbDjh_gcYhebgQ5_EsVZwoaaC8hbxjme5E8AE_R0_X8IQtO6WCX5FDEZ1as'
  }


  onForegroundMessage()
      .then((payload) => {
        console.log('Received foreground message: ', payload);
        const { notification: { title, body } } = payload;
        toast(<ToastifyNotification title={title} body={body} />);
      })
      .catch(err => console.log('An error occured while retrieving foreground message. ', err));

  const ToastifyNotification = ({ title, body }) => (
    <div className="push-notification">
      <h2 className="push-notification-title">{title}</h2>
      <p className="push-notification-text">{body}</p>
    </div>
  );

  function handleClick() {
    axios
      .post(baseURL, {
        "notification": {
          "title": titleRef.current.value,
          "body": messRef.current.value,
          "icon": "firebase-logo.png"
        },
        "to": tokenRef.current.value
      }, {
        headers: headers
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
  }



  const titleRef = useRef(null);
  const messRef = useRef(null);
  const tokenRef = useRef(null);

  
  return (
    <div className="app">
      <button className="btn-primary" onClick={signIn}>
        Sign In
      </button>
      <button className="btn-primary" onClick={signOff}>
        Sign Out
      </button>

      <button className="btn-primary" onClick={subscribeButton}>
        Subscribe
      </button>
      <button className="btn-primary" onClick={unsubscribeButton}>
        Unsubscribe
      </button>
      <button className="btn-primary" onClick={allids}>
        getallids
      </button>



      <form>
        <label>
          Title:
          <input ref={titleRef} type="text" id="title" name="title" />
        </label>
        <label>
          Message:
          <input ref={messRef} type="text" id="message" name="message" />
        </label>
        <label>
          Token:
          <input ref={tokenRef} type="text" id="token" name="token" />
        </label>
      </form>

      <button
        className="btn-primary"
        onClick={() => {
          handleClick();
        }}
      >
        Send Notification
      </button>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
