import socket from '../socket'
import store from './store';
import { characterAdded, characterDeleted, characterSubLocationUpdated, characterUpdated } from './entities/characters';
import { locationUpdated } from './entities/locations';
import { tradeAdded, tradeDeleted, tradeUpdated } from './entities/trades';
import { assetAdded, assetDeleted, assetUpdated } from './entities/assets';
import { teamUpdated } from './entities/teams';
import { gamestateReceived } from './entities/gamestate';
import { facilityUpdated } from './entities/facilities';
import { iceUpdated } from './entities/ice';
import { actionLogUpdated } from './entities/actionLogs';
import { accountAdded, accountUpdated } from './entities/accounts';
// import { marketUpdated } from './entities/markets';
import { clockReceived } from './entities/clock';
import { actionDeleted, playerActionUpdated } from './entities/playerActions';
import { blueprintUpdated } from './entities/blueprints';
import { articleDeleted, articleUpdated } from './entities/articles';
import { eventUpdated } from './entities/events';


const initUpdates = () => {
    socket.on('connect', () => { console.log('UwU I made it') });
    socket.on('updateClients', (data) => { 
        // console.log('updateClients');
        for (const el of data) {
            // console.log(el)
            if (el) {
                switch(el.model) {
                    case 'Log':
                        store.dispatch(actionLogUpdated(el));
                        break;
                    case 'Action':
                        store.dispatch(playerActionUpdated(el));
                        break;
                    case 'Article':
                      store.dispatch(articleUpdated(el));
                      break;
                    case 'Blueprint':
                      store.dispatch(blueprintUpdated(el));
                      break;
                    case 'Character':
                        store.dispatch(characterUpdated(el));
                        break;
                    // case 'Market':
                    //     store.dispatch(marketUpdated(el));
                    //     break;
                    case 'Account':
                        store.dispatch(accountUpdated(el));
                        break;
                    case 'Team':
                        store.dispatch(teamUpdated(el));
                        break;
                    case 'Location':
                        store.dispatch(locationUpdated(el));
                        break;
                    case 'Facility':
                        store.dispatch(facilityUpdated(el));
                        break;               
                    case 'Clock':
                        store.dispatch(clockReceived(el));
                        break;
                    case 'Asset':
                        store.dispatch(assetUpdated(el));
                        break;
                    case 'Trade':
                        store.dispatch(tradeUpdated(el));
                        break;
                    case 'Ice':
                        store.dispatch(iceUpdated(el));
                        break;
                    case 'ActionLog':
                        store.dispatch(actionLogUpdated(el));
                        break;
                    case 'GameState':
                        store.dispatch(gamestateReceived(el));
                        break;
                    case 'event':
                    case 'match':
                    case 'Event':
                        store.dispatch(eventUpdated(el));
                        break;
                    default:
                        console.log(`Unable to updateClients Redux for ${el.model}: ${el._id}`);
                        break;
                }                
            }
            else
            console.log(`Defined Error: Unable to updateClients Redux for ${el}`);

        }
    });

    socket.on('createClients', (data) => { 
        console.log('createClients');
        for (const el of data) {
            switch(el.model) {
                case 'Character':
                    store.dispatch(characterAdded(el));
                    break;
                case 'Trade':
                    store.dispatch(tradeAdded(el));
                    break;
                case 'Account':
                  store.dispatch(accountAdded(el));
                  break;
                default:
                    console.log(`Unable to createClients Redux for ${el.model}: ${el._id}`);
                    break;
            }
        }
    });

    socket.on('deleteClients', (data) => { 
        console.log('deleteClients');
        for (const el of data) {
            // console.log(el); // for debugging
            switch(el.model) {
                case 'asset':
                case 'Asset':
                    store.dispatch(assetDeleted(el));
                    break;
                case 'Trade':
                    store.dispatch(tradeDeleted(el));
                    break;
                case 'Gamestate':
                    console.log('DEAR GOD IF YOU SEE THIS FUCKING CALL SCOTT OH GOD HOW COULD THIS HAPPEN')
                    break;
                case 'character':
                  store.dispatch(characterDeleted(el));
                  break;
                case 'action':
                    store.dispatch(actionDeleted(el));
                    break;
                case 'Article':
                  store.dispatch(articleDeleted(el));
                  break;
                default:
                    console.log(`Unable to deleteClients Redux element for ${el.model}: ${el._id}`);
                    break;
            }
        }
    });

    socket.on('updateSublocation', (data) => { 
        console.log('updateSublocation');
        store.dispatch(characterSubLocationUpdated(data));
    });
}

export default initUpdates;