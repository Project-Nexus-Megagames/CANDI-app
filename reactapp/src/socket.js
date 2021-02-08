import openSocket from 'socket.io-client';
import { gameServer } from './config';

const socket = openSocket(gameServer);

export default socket;