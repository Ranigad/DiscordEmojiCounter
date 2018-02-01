// Discord
const Discord = require("discord.js");
const client = new Discord.Client();

// Websocket
// Server 
//const app = require("express")();
//const http = require("http").Server(app);
//const io = require("socket.io")(http);

// File open
const fs = require("fs");

// Client
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

var emojiCount = {};
var regex = /\<\:([\w]{2,})\:([\d]+)\>/g;

var emojiExists = function(server, emojiName) {
    return emojiName in emojiCount[server];
}

var serverExists = function(server) {
    return server in emojiCount;
}

var populateServerEmojis = function(server) {
    emojiCount[server] = {};
    server.emojis.array().forEach((emoji) => {
        emojiCount[server][emoji.name] = 0;
    });
    console.log("Populated " + server.name + "'s emojis");
}

var addEmoji = function(server, emojiName) {
    emojiCount[server][emojiName] = 0;
}

client.on('ready', () => {
    console.log("Connection Established");
});

var serverCheck = function(server) {
    if(!(serverExists(server))) {
        console.log(`Initializing ${server.name}`);
        populateServerEmojis(server);
        /*
        emojiCount[server] = {};
        server.emojis.array().forEach((emoji) => {
            console.log(emoji.name);
            emojiCount[server][emoji.name] = 0;
        });
        // */
    } 
}

client.on('message', msg => {
    let content = msg.content;
    let server = msg.guild;
    // If server isn't in the database, add the server and populate its emojis.
    serverCheck(server);
    
    let m;

    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        let emojiName = m[1];
        if(!(emojiExists(server, emojiName))) {
            addEmoji(server, emojiName);
        }
        
        emojiCount[server][emojiName] += 1;
        socket.emit('emoji', emojiName);

        //console.log(`Emoji : ${m[1]} | Count : ${emojiCount[server][m[1]]}`);
        // The result can be accessed through the `m`-variable.
        /*
        m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
        });
        // */
    }

    //console.log(content);
    
});

client.on('messageReactionAdd', (msgReaction, user) => {
    let emoji = msgReaction.emoji;
    let server = msgReaction.message.guild;
    let emojiName = emoji.name;
    console.log(`New Reaction! ${emojiName} in ${server}`);
    serverCheck(server);
    if(!(emojiExists(server, emojiName))) {
        addEmoji(server, emojiName);
    }

    emojiCount[server][emojiName] += 1;
    socket.emit('emoji', emojiName);

});

client.on('messageReactionRemove', (msgReaction, user) => {
    let emoji = msgReaction.emoji;
    let server = msgReaction.message.guild;
    let emojiName = emoji.name;

    console.log(`Reaction removed. ${emojiName} in ${server}`);
    serverCheck(server);
    if(!(emojiExists(server, emojiName))) {
        addEmoji(server, emojiName);
    }
    
    emojiCount[server][emojiName] -= 1;
    socket.emit('emojiRemove', emojiName);

});

var fileName = process.argv[2];
var key = JSON.parse(fs.readFileSync(fileName));
client.login(key["emojiCounter"]);
