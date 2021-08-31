import { Component, OnInit } from '@angular/core'
import { AccountService } from '../account.service'
import { RouterService } from '../router.service'

@Component({
  selector: 'vii-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

  constructor(public router : RouterService, public account : AccountService) { }

  ngOnInit(): void {
  }

  getAccountLinkName() : string {
    if (this.account.username) return this.account.username
    return 'My Account'
  }

}
