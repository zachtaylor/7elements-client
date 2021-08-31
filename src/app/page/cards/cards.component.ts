import { Component, OnInit } from '@angular/core'
import { AccountService } from 'src/app/account.service'
import { GlobalService } from 'src/app/global.service'

@Component({
  selector: 'vii-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.less']
})
export class CardsComponent implements OnInit {

  constructor(public glob : GlobalService, public account : AccountService) { }

  ngOnInit(): void {
  }

}
