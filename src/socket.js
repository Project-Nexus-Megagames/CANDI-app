import { io } from "socket.io-client";
import { gameServer } from './config';
// import store from "./redux/store";

const URL = gameServer;
const socket = io(URL, { autoConnect: false });

// DEBUG event showing any event thrown over the socket in console
// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });

export function initConnection(user, character, version) {
  console.log('Socket Connecting....')
  socket.auth = { username: user.username, character: character ? character.characterName : "Unassigned" , version }
    
  //console.log(socket);
  socket.connect();
}

export default socket;