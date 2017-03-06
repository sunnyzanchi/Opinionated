import {Subject} from 'rx';

const stream = new Subject();
export default stream;

export const allPlayersUpdate = stream.where(x => x.name === 'allPlayersUpdate');
export const allScores = stream.where(x => x.name === 'allScores');
export const nameUpdate = stream.where(x => x.name === 'nameUpdate');
export const playerQuit = stream.where(x => x.name === 'playerQuit');
export const playerStatusUpdate = stream.where(x => x.name === 'playerStatusUpdate');
export const playersUpdate = stream.where(x => x.name === 'playersUpdate');
export const roomsListUpdate = stream.where(x => x.name === 'roomsListUpdate');
export const roundUpdate = stream.where(x => x.name === 'roundUpdate');
export const updateRoom = stream.where(x => x.name === 'updateRoom');
