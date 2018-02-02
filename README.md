# DiscordEmojiCounter

A small project filling a need on the magiarecord discord while simultaneously
practicing and becoming familiar with NodeJS, WebSocket technology, and D3. 

# Description

Currently actually a two part pipeline with a nodeJS server middleman. 

1. Simple bot built from the NodeJS framework (see below) that listens and
   parses messages for emojis and reacts. Upon detection, sends out the name via
a webSocket channel.

2. NodeJS server that listens for the bot's message and repeats it as a
   broadcast to all connected parties.

3. HTML frontend that listens locally for updates via two channels, one
   representing an increment and one a decrement. Keeps values stored in runtime
locally and updates a bargraph of usage in real time.

# Previous Version Description

Three part pipeline that keeps a tally of emoji usage in the bots' server. 

1. Simple bot built from the NodeJS framework (https://discord.js.org/#/) that
   listens and parses messages for emojis. Upon detection, sends out the name
via a webSocket.

2. NodeJS server that listens for the bot's message. Updates the runtime
   database accordingly and then sends a message via webSocket.

3. HTML frontend that listens locally for updates to the data and utilizes D3 to provide
   a simple visualization of the data.


# TODO
    x Add capability for bot to listen for reactions, removal of reactions, and
      then also take into account edits that remove emojis (last one not
necessary).
    - Add external database for permanent data collection.
    - Add better visualization for D3.
    x Migrate and refactor emojiListener to have dependency on the emojiCounter module.
