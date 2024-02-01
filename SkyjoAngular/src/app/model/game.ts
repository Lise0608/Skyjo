import { Player } from './player';

export class Game {
  constructor(
    public id?: number,
    public scoreAAtteindre?: number,
    public nombreDeTours?: string,
    public specificites?: string,
    public players?: Player[],
    public date?: Date,
    public showDetails: boolean = false
  ) {}
}
