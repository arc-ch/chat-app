import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server,
    {
      cors: {
        origin: ["http://localhost:5173"],
      }
    })

    // This function is used to get the socketId of the receiver user from the sender's userId
    export function getReceiverSocketId(userId) {
        return userSocketMap[userId];
      }

// Used to store the online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection",(socket)=> {
    console.log("a user connected", socket.id); 
    // as soon one is connected upodate the online users list
    const userId = socket.handshake.query.userId; // received from query object see in useAuthstore
    
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected listeners
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
            delete(userSocketMap[userId]);
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        })
})

export { io, app, server } ;
