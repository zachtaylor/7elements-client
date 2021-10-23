import { Component } from '@angular/core'
import { RouterService } from 'src/app/router.service'

@Component({
  selector: 'vii-lost',
  templateUrl: './lost.component.html',
  styleUrls: ['./lost.component.less']
})
export class LostComponent {
  constructor(private router : RouterService) {}
  reload() {
    this.router.goto('/')
    setTimeout(() => { window.location.reload() })
  }
}
