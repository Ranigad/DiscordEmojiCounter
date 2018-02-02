const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var emojiCount = {};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/emojiUsage.html');
});

io.on('connection', function(socket){
    //*
    console.log('a user connected.');

    // io.emit("emojiCount", JSON.stringify(emojiCount));

    socket.on('disconnect', function() {
        console.log('a user disconnected');
    });
    
    // */
    // /*
    socket.on('emoji', function(emojiName) {
        console.log(emojiName);
        /*
        if(!(emojiName in emojiCount)) {
            emojiCount[emojiName] = 1;
        } else {
            emojiCount[emojiName] += 1;
        }
        // */
        io.emit("emoji", emojiName);
        //console.log(emojiCount);
    });
    // */
    
    socket.on('emojiRemove', function(emojiName) {
        io.emit("emojiRemove", emojiName);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});


