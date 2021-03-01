import { assetsReceived } from './entities/assets';
import { charactersReceived } from './entities/characters';
import { gamestateReceived } from './entities/gamestate';
import { playerActionsReceived, playerActionUpdated } from './entities/playerActions';
import socket from '../socket'
import store from './store';

const initUpdates = () => {
    socket.on('connect', () => { console.log('UwU I made it') });
	socket.on('updateCharacters', (data) => { store.dispatch(charactersReceived(data)) });
    socket.on('updateActions', (data) => { store.dispatch(playerActionsReceived(data)) });
    socket.on('updateAction', (data) => { store.dispatch(playerActionUpdated(data)) });
    socket.on('updateGamestate', (data) => { store.dispatch(gamestateReceived(data)) });
    socket.on('updateAssets', (data) => { store.dispatch(assetsReceived(data)) });
}



export default initUpdates;