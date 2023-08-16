import { assetAdded, assetDeleted, assetUpdated } from './entities/assets';
import { characterAdded, characterDeleted, characterUpdated } from './entities/characters';
import { gamestateReceived } from './entities/gamestate';
import { playerActionUpdated, actionAdded, actionDeleted } from './entities/playerActions';
import { logAdded } from './entities/log';
import { articleAdded, articleUpdated, articleDeleted } from './entities/articles';
import socket from '../socket'
import store from './store';
import { locationUpdated } from './entities/locations';

const initUpdates = () => {
    socket.on('updateClients', (data) => {
        console.log('updateClients');
        for (const el of data) {
            switch(el?.model) {
                case 'Character':
                    store.dispatch(characterUpdated(el));
                    break;
                case 'Action':
                    store.dispatch(playerActionUpdated(el));
                    break;
                case 'GameState':
                    store.dispatch(gamestateReceived(el));
                    break;
                case 'Asset':
                    store.dispatch(assetUpdated(el));
                    break;
                case 'Location':
                    store.dispatch(locationUpdated(el));
                    break;
                case 'Log':
                    store.dispatch(logAdded(el));
                    break;
                case 'Article':
                    store.dispatch(articleUpdated(el));
                    break;
                default:
                    console.log(el)
                    console.log(`Unable to update Redux for ${el?.model}: ${el._id}`);
                    break;
            }
        }
    });

    socket.on('createClients', (data) => {
        console.log('createClients');
        for (const el of data) {
            switch(el.model) {
                case 'Character':
                    store.dispatch(characterAdded(el));
                    break;
                case 'Action':
                    store.dispatch(actionAdded(el));
                    break;
                case 'Gamestate':
                    console.log('DEAR GOD IF YOU SEE THIS FUCKING CALL SCOTT OH GOD HOW COULD THIS HAPPEN')
                    break;
                case 'Asset':
                    store.dispatch(assetAdded(el));
                    break;
                default:
                    console.log(`Unable to add Redux for ${el.model}: ${el._id}`);
                    break;
            }
        }
    });

    socket.on('deleteClients', (data) => {
        console.log('deleteClients');
        for (const el of data) {
            switch(el.model) {
                case 'character':
                    store.dispatch(characterDeleted(el));
                    break;
                case 'action':
                    store.dispatch(actionDeleted(el));
                    break;
                case 'Gamestate':
                    console.log('DEAR GOD IF YOU SEE THIS FUCKING CALL SCOTT OH GOD HOW COULD THIS HAPPEN')
                    break;
                case 'asset':
                    store.dispatch(assetDeleted(el));
                    break;
								case 'Article':
									store.dispatch(articleDeleted(el));
									break;
                default:
                    console.log(`Unable to add Redux for ${el.model}: ${el.id}`);
                    break;
            }
        }
    });

    socket.on('clearLocalStorage', (data) => {
        console.log('clearLocalStorage');
        localStorage.removeItem(data);
    });

    socket.on('errorUnload', (data) => {
        console.log('errorUnload');
    });
}



export default initUpdates;