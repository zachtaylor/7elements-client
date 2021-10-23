import { Component } from '@angular/core'
import { DataService } from 'src/app/data.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent {

  constructor(
    public data : DataService,
    private ws : WebsocketService
  ) { }

  changeSettingsPVP($event : boolean) {
    let old = this.data.newgamesettings$.value
    this.data.setNewGameSettings(old.deckid, old.owner, $event, old.hands, old.speed)
  }

  changeSettingsHands(hands : string) {
    let old = this.data.newgamesettings$.value
    if (hands == 'small' || hands == 'med' || hands == 'large')
      this.data.setNewGameSettings(old.deckid, old.owner, old.pvp, hands, old.speed)
  }

  changeSettingsSpeed(speed : string) {
    let old = this.data.newgamesettings$.value
    if (speed == 'slow' || speed == 'med' || speed == 'fast')
      this.data.setNewGameSettings(old.deckid, old.owner, old.pvp, old.hands, speed)
  }

  submitNewGame() {
    let settings = this.data.newgamesettings$.value
    this.ws.send('/game/new', settings)
  }

  submitCancelQueue() {
    this.ws.send('/game/cancel', {})
  }

}
