import { useEffect} from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { onForegroundMessage, unsubscribeButton, signIn, signOff, subscribeButton} from './firebase';



export default function App() {

  useEffect(() => {
    onForegroundMessage()
      .then((payload) => {
        console.log('Received foreground message: ', payload);
        const { notification: { title, body } } = payload;
        toast(<ToastifyNotification title={title} body={body} />);
      })
      .catch(err => console.log('An error occured while retrieving foreground message. ', err));
  }, []);

  const ToastifyNotification = ({ title, body }) => (
    <div className="push-notification">
      <h2 className="push-notification-title">{title}</h2>
      <p className="push-notification-text">{body}</p>
    </div>
  );


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
