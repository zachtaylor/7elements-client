import { Component } from '@angular/core'
import { DataService } from 'src/app/data.service'

@Component({
  selector: 'vii-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.less']
})
export class DecksComponent  {

  constructor(public data : DataService) { }

  clickSetDeck(deckid: number, owner: string) {
    let old = this.data.newgamesettings$.value
    this.data.setNewGameSettings(deckid, owner, old.pvp, old.hands, old.speed)
  }

}
