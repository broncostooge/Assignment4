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
});

client.set('question_ID', 0, function(){});
client.set('correct_ID', 0, function(){});
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

//Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Database");
});

client.incr('correct_ID', function(err, ID) {
    var collection = db.collection('correct');
    var input = {
        "right": 0,
        "wrong": 0,
        "_id": ID
    };

    collection.insert([input], function(err, result) {
        if(err){
            console.log(err);
        }
    });
});

// Home Page
app.get('/', function(req, res) {
    res.render('index');
});

// Posting new question
app.post('/question', function(req, res) {

    client.incr('question_ID', function(err, ID) {
        var collection = db.collection('questions');
        var input = {
            "Question": req.body.Question,
            "Answer": req.body.Answer,
            "_id": ID
        };

        collection.insert([input], function(err, result) {
            if(err){
                console.log(err);
            }
            else{
                res.json({'Question': input.Question, 'Answer': input.Answer});
            }
        });
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
    console.log(cursor[0]);
    if(curser.length == 0){
        console.log('hi');
        res.json({"correct": "Database is empty."});
    }
    else{
        cursor.forEach(function(Question) {
        if(Question._id == req.body.ID && Question.Answer == req.body.Answer) {
            client.incr('right', function(err,result) {
                    var correct = db.collection('correct');
                    correct.update({_id: 1 },{ $set: { right: result } });
                });
                res.json({"correct": "true"});
            }
            else{
                client.incr('wrong', function(err,result) {
                    var correct = db.collection('correct');
                    correct.update({_id: 1 },{ $set: { wrong: result } });
                });
                res.json({"correct": "false"});
            }
        });
    }
});

app.get('/score', function(req, res) {
    var collection = db.collection('correct');
    collection.find().toArray(function(err, questions) {
        res.send(questions[0]);
    });

});

