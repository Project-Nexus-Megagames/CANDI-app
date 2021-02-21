import { io } from 'socket.io-client';
// import { gameServer } from '../config';
import { assetsReceived } from './entities/assets';
import { charactersReceived } from './entities/characters';
import { gamestateReceived } from './entities/gamestate';
import { playerActionsReceived } from './entities/playerActions';
import store from './store';
const socket = io(`ws://localhost:5000/`);

const initUpdates = () => {
    // socket.on('connect', () => { console.log('UwU I made it') });
	// socket.on('updateCharacters', (data) => { store.dispatch(charactersReceived(data)) });
    // socket.on('updateActions', (data) => { store.dispatch(playerActionsReceived(data)) });
    // socket.on('updateGamestate', (data) => { store.dispatch(gamestateReceived(data)) });
    // socket.on('updateAssets', (data) => { store.dispatch(assetsReceived(data)) });
}

export default initUpdates;