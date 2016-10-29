var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    app = express(),
    MongoClient = mongodb.MongoClient,
    redis = require('redis');

client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
})

client.set('id', 0, function(){});
client.set('right', 0, function(){});
client.set('wrong', 0, function(){});

app.use(express.static(__dirname + '/public'));

// Create our Express-powered HTTP server
http.createServer(app).listen(3000);
console.log('Running on port http://localhost:3000/');

mongoose.Promise = global.Promise;
// Support JSON-encoded bodies
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

// Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Database");
});

// Home Page
app.get('/', function(req, res) {
    res.render('index');
});

// Posting new question
app.post('/question', function(req, res) {

    client.incr('id', function(err, answerID) {
        var collection = db.collection('questions');
        var input = {
            "Question": req.body.Question,
            "Answer": req.body.Answer,
            "answerID": answerID,
            "meta": {
                "right": 0,
                "wrong": 0
            }
        };

        collection.insert([input], function(err, result) {
            if(err){
                console.log(err);
            }
            else{
                res.json({'Question': input.Question, 'Answer': input.Answer});
            }
        })
    });
});


app.get('/question', function(req, res) {
    var collection = db.collection('questions');
    collection.find().toArray(function(err, questions) {
        res.send(questions[0]);
    });
});


app.post('/answer', function(req, res) {

    var collection = db.collection('questions');
    var cursor = collection.find();
    cursor.forEach(function(Question) {
        if(Question.answerID == req.body.ID)
            if(Question.Answer == req.body.Answer) {
                right = client.incr('right', function() {});
                res.json({"correct": "true"});
            }
            else
            {
                wrong = client.incr('wrong', function() {});
                res.json({"correct": "false"});
            }
    });
});

app.get('/score', function(req, res) {

});

