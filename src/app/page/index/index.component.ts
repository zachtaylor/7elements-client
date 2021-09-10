import { Component } from '@angular/core'
import { DataService } from 'src/app/data.service'
import { RuntimeService } from 'src/app/runtime.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent {

  constructor(
    public runtime : RuntimeService,
    public data : DataService,
    private ws : WebsocketService
  ) { }

  changeQueuePVP($event : boolean) {
    let old = this.runtime.queue$.value
    this.runtime.setQueue($event, old.custom, old.hands, old.speed)
  }

  changeQueueCustom(toggleCustom, $event : boolean) {
    let old = this.runtime.queue$.value
    if (this.runtime.deck$.value.user !== 'vii' && !$event) {
      window.setTimeout(() => { toggleCustom.check = true }, 1)
    } else {
      this.runtime.setQueue(old.pvp, $event, old.hands, old.speed)
    }
  }

  changeQueueHands(hands : string) {
    let old = this.runtime.queue$.value
    if (hands == 'small' || hands == 'med' || hands == 'large') this.runtime.setQueue(old.pvp, old.custom, hands, old.speed)
  }

  changeQueueSpeed(speed : string) {
    let old = this.runtime.queue$.value
    if (speed == 'slow' || speed == 'med' || speed == 'fast') this.runtime.setQueue(old.pvp, old.custom, old.hands, speed)
  }

  submitNewGame() {
    let deckset = this.runtime.deck$.value
    let queueset = this.runtime.queue$.value

    console.debug('submitNewGame', {
      deckid: deckset.id,
      deckuser: deckset.user,
      pvp:queueset.pvp,
      custom:queueset.custom,
      hands:queueset.hands,
      speed:queueset.speed,
    })
  }
}
