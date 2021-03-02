import { assetsReceived } from './entities/assets';
import { charactersReceived, characterUpdated } from './entities/characters';
import { gamestateReceived } from './entities/gamestate';
import { playerActionsReceived, playerActionUpdated, actionAdded, actionDeleted } from './entities/playerActions';
import socket from '../socket'
import store from './store';

const initUpdates = () => {
    socket.on('connect', () => { console.log('UwU I made it') });
	socket.on('updateCharacters', (data) => { store.dispatch(charactersReceived(data)) });
	socket.on('updateCharacter', (data) => { store.dispatch(characterUpdated(data)) });


    socket.on('updateActions', (data) => { store.dispatch(playerActionsReceived(data)) });
    socket.on('updateAction', (data) => { store.dispatch(playerActionUpdated(data)) });
    socket.on('actionCreated', (data) => { store.dispatch(actionAdded(data)) });
    socket.on('actionDeleted', (data) => { store.dispatch(actionDeleted(data)) });
    
    socket.on('updateGamestate', (data) => { store.dispatch(gamestateReceived(data)) });
    socket.on('updateAssets', (data) => { store.dispatch(assetsReceived(data)) });
}



export default initUpdates;