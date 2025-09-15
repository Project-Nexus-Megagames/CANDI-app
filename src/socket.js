import { io } from "socket.io-client";
import { gameServer } from './config';
// import store from "./redux/store";

const URL = gameServer;
const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true
});

// DEBUG event showing any event thrown over the socket in console
// socket.onAny((event, ...args) => {
//   console.log(args);
// });

export function initConnection(user, character, version) {
  console.log('Socket Connecting....')
  socket.auth = { username: user.username, character: character ? character.characterName : "Unassigned", version }

  console.log(socket, URL);
  socket.connect();
  console.log(socket);
  console.log('Socket done')
}

export default socket;