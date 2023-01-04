var admin = require("firebase-admin");
var serviceAccount = require("./tally-notitia-firebase-adminsdk-glr82-377ba23980.json");
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tally-notitia-default-rtdb.firebaseio.com"
});
var database = admin.database();

var title = "";
var body = "";
async function sendNotification() {
    var tokenarray=[];
    const Tref=database.ref("/tokens")
    Tref.once("value", function(snapshot) {
    const data=snapshot.val()
    for(let i in data){
      tokenarray.push(data[i].token)
    }
    var message = {
      notification: {
        title: title,
        body: body,
        sound: 'enable',
      },
     
    };
    admin.messaging().sendToDevice(tokenarray, message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
  })
 }


 app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


 app.post('/', (req,res) => {
  title = req.body.title;
  body = req.body.message;
  sendNotification()
  res.redirect('/');
 
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server listening on PORT");
  });