import express, { Request, Response, Application } from "express";
import cors from "cors";
import https from "https";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

//** CONFIG **/
const app: Application = express();
dotenv.config();
const FILE_Directiry = path.resolve(
  "/Users/turkialqahtani/Desktop/GP2/server/file-uploads"
);

//** SSL_SERVER **//
const SSL_SERVER = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

//** SOCKET_SERVER **//
const io = new Server(SSL_SERVER, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

//** MIDDLEWARE **/
app.use(express.json());
app.use("/uploads", express.static(FILE_Directiry));
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the chat-service");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", ({ to, signal }) => {
    io.to(to).emit("callaccepted", signal);
  });
});

SSL_SERVER.listen(process.env.PORT, () => {
  console.log(`secure server on port ${process.env.PORT}`);
});
