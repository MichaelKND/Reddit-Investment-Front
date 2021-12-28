const express = require('express');
const fs  = require('fs');
const { MongoClient } = require('mongodb');
const { cursorTo } = require('readline');
const CONNECTION_URL = fs.readFileSync("credentials.txt", 'utf-8');

var app = express();
const port = 3000
const DATABASE_NAME = "reddit"
var collection, databaseMain;

async function getPosts(database, subreddit, stock) {
    var dayScore = new Map();
    await database.collection(subreddit).find({query: stock})
        .toArray()
        .then( function(postCursor) {
            postCursor.forEach( function(myDoc) {
                var docDate = myDoc.date.toString();
                if (dayScore.has(docDate)) {
                    var current = dayScore.get(docDate);
                    dayScore.set(docDate, (current + myDoc.score));
                } else {
                    dayScore.set(docDate, myDoc.score);
                }
            })
        });
    
    dates = Array.from(dayScore.keys());
    scores = [];
    for (const date of dates) {
        scores.push(dayScore.get(date));
    }

    return [dates, scores];
}

app.use('/', express.static(__dirname));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')
});

app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
    MongoClient.connect(CONNECTION_URL, async function(err, client) {
        if (err) throw err;
        databaseMain = client.db('reddit');
        console.log("Connected to database " + databaseMain.databaseName);
    });
});

app.get("/:subreddit/:stock", async function(req,res){
    var postData = await getPosts(databaseMain, req.params.subreddit, req.params.stock);
    res.send(postData);
});