import { Component } from '@angular/core'
import { AccountService } from 'src/app/account.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent {

  constructor(
    public account : AccountService,
    public ws : WebsocketService
  ) { }

}
