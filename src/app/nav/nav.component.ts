import { Component, OnInit } from '@angular/core'
import { DataService } from '../data.service'
import { RouterService } from '../router.service'

@Component({
  selector: 'vii-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent {

  constructor(
    public router : RouterService,
    public data : DataService
  ) { }

}
