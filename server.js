const express = require("express");
const app = express(); //instatiate the express app
const http = require("http"); //allow the app to transfer data over http
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server); //this is what we will use to pass messages
const PORT = 3000;

const messages = [];

app.get("/", (req, res) => {
    //res.send("<h1>Hola Senior Klins!</h1>");
    res.sendFile(__dirname + "/pages/index.html");
});

app.get("/ducks", (req, res) => {
    res.send("<h1>Quack, Quack</h1>");
});

io.on("connection", (socket) => {
    console.log(`A user connected`);
    for (let message of messages) {
        socket.emit("message", message);
    }
    //socket.name =
    socket.on("set username", (uname) => {
        socket.name = uname;
    });

    socket.on("chat message", (msg) => {
        let messageObj = { user: socket.name, text: msg };
        messages.push(messageObj);
        io.emit("message", messageObj);
    });

    // Source - https://stackoverflow.com/a/59479502
    // Posted by Marcos Casagrande, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-11-19, License - CC BY-SA 4.0

    // sending media from server side
    socket.on("base64 file", function (msg) {
        console.log("received base64 file from server: " + msg.fileName);
        socket.username = msg.username;
        io.emit(
            "base64 image", //exclude sender
            // io.sockets.emit(
            //   "base64 file", //include sender

            {
                file: msg.file,
                fileName: msg.fileName,
            },
        );
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});
 