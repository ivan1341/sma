const signalR = require("@aspnet/signalr");
const me = "smarthome";



XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
WebSocket = require("websocket").w3cwebsocket;


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


var hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://a103.azurewebsites.net/chatHub")
    .build();


    const url = 'mongodb://localhost:27017';

    // Database Name
    const dbName = 'myproject';
    
    // Create a new MongoClient
    const client = new MongoClient(url,{ useNewUrlParser: true });
    
    // Use connect method to connect to the Server

function insertLog(document){
    client.connect(function(err) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
    
      const db = client.db(dbName);

      insertDocuments(db, document, function() {
        client.close();
      });
      
      
    });

}

    const insertDocuments = function(db, document, callback) {
        // Get the documents collection
        const collection = db.collection('documents');
        // Insert some documents
        db.collection('inserts').insertOne(
          {a : "y"}
        , function(err, result) {
          assert.equal(null, err);
          assert.equal(1, result.result.n);
          console.log("Inserted 1 documents into the collection");
          callback(result);
        });
      }

hubConnection.start()
    .then(() => {
        hubConnection.stream("StreamStocks").subscribe({
            next: (stock) => {
                console.log("ivan" + stock);
                // console.log(stock.Symbol + " " + stock.Price);
            },
            error: (err) => { },
            complete: () => { }
        });
    });

    hubConnection.on("send", data => {
      console.log(data);
  });
   
  hubConnection.on("ReceiveMessage", function (user, message) {
    console.log(user + " dice: "+message);

    

        
    if(me != user){
        insertLog();
    hubConnection.invoke("SendMessage", me, message + "Recibido" ).catch(function (err) {
        return console.error(err.toString());
    });
    }
});