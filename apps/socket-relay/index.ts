import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Port 3005 for the socket relay
const PORT = 3005;

io.on('connection', (socket: any) => {
    console.log('User connected:', socket.id);

    // Join a match room
    socket.on('join-match', (matchId: string) => {
        socket.join(`match:${matchId}`);
        console.log(`Socket ${socket.id} joined room match:${matchId}`);
    });

    // Handle match updates from the scoring engine
    socket.on('update-match', (data: { matchId: string, state: any }) => {
        // Broadcast the update to everyone in that match room
        io.to(`match:${data.matchId}`).emit('match-updated', data.state);
        console.log(`Broadcasted update for match ${data.matchId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Socket Relay Server running on port ${PORT}`);
});
