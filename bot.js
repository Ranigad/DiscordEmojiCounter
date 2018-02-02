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

// Modules
const EmojiCounter = require("./emojicounter.js");

// Client
const io = require('socket.io-client');
const socket = io('http://localhost:3000');


// Creating the emojicounter
var ec = new EmojiCounter.EmojiCounter(socket);

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
    ec.serverCheck(server);
   
    ec.parseMessage(content, server);

});

client.on('messageReactionAdd', (msgReaction, user) => {
    let emoji = msgReaction.emoji;
    let server = msgReaction.message.guild;
    let emojiName = emoji.name;
    console.log(`New Reaction! ${emojiName} in ${server}`);
    ec.serverCheck(server);
    if(!ec.emojiExists(server, emojiName)) {
        ec.newEmoji(server, emojiName);
    }
    
    ec.updateEmojiCount(server, emojiName, 1);
    socket.emit('emoji', emojiName);

});

client.on('messageReactionRemove', (msgReaction, user) => {
    let emoji = msgReaction.emoji;
    let server = msgReaction.message.guild;
    let emojiName = emoji.name;

    console.log(`Reaction removed. ${emojiName} in ${server}`);
    ec.serverCheck(server);
    if(!ec.emojiExists(server, emojiName)) {
        ec.addEmoji(server, emojiName);
    }
    
    ec.updateEmojiCount(server, emojiName, -1);
    socket.emit('emojiRemove', emojiName);

});

var fileName = process.argv[2];
var key = JSON.parse(fs.readFileSync(fileName));
client.login(key["emojiCounter"]);
