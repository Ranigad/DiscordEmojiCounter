"use strict";

class EmojiCounter {
    
    constructor(s) {
        this.socket = s;
        this.emojiCount = {};
        this.regex = /\<\:([\w]{2,})\:([\d]+)\>/g;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    getEmojis(server) {
        if (server !== undefined) {
            return this.emojiCount[server];
        } else {
            return this.emojiCount;
        }
    }

    // Check existences
    emojiExists(server, emojiName) {
        return emojiName in this.emojiCount[server];
    }

    serverExists(server) {
        return server in this.emojiCount;
    }

    // Adding new elements
    newServer(server) {
        this.emojiCount[server] = {};
        server.emojis.array().forEach((emoji) => {
            this.emojiCount[server][emoji.name] = 0;
        });
        console.log("Populated " + server.name + "'s emojis");
    }

    newEmoji(server, emojiName) {
        this.emojiCount[server][emojiName] = 0;
    }

    updateEmojiCount(server, emojiName, num) {
        this.emojiCount[server][emojiName] += num;
    }

    // General entry into server check
    serverCheck(server) {
        if(!this.serverExists(server)) {
            console.log(`Initializing ${server.name}`);
            this.newServer(server);
        } 
    }

    parseMessage(message, server) {
        // Code based off of regex101.com
        let m;

        while((m = this.regex.exec(message)) !== null) {
            // Avoiding infinite loops
            if (m.index === this.regex.lastIndex) {
                regex.lastIndex++;
            }

            let emojiName = m[1];
            if(!this.emojiExists(server, emojiName)) {
                this.emojiName(server, emojiName);
            }

            this.updateEmojiCount(server, emojiName, 1);
            
            if(this.socket !== undefined) {
                this.socket.emit('emoji', emojiName);
                console.log(`${emojiName} emitted`);
            } else {
                console.error("Socket not specified");
            }
        }
    }
}

module.exports.EmojiCounter = EmojiCounter;

