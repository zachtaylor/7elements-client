import { Component } from '@angular/core'
import { AccountService } from 'src/app/account.service'
import { GlobalService } from 'src/app/global.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.less']
})
export class BuyComponent {

  constructor(public glob : GlobalService, public account : AccountService, private ws : WebsocketService) { }

  clickBuyPack(packid: number) {
    this.ws.send('/packs/buy', {
      'packid': packid,
    })
  }

}
