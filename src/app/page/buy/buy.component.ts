import { Component } from '@angular/core'
import { DataService } from 'src/app/data.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.less']
})
export class BuyComponent {

  constructor(public data : DataService, private ws : WebsocketService) { }

  clickBuyPack(packid: number) {
    this.ws.send('/packs/buy', {
      'packid': packid,
    })
  }

}
