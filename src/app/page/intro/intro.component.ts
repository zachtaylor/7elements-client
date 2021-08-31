import { Component } from '@angular/core'
import { GlobalService } from 'src/app/global.service'

@Component({
  selector: 'vii-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.less']
})
export class IntroComponent {

  constructor(public glob : GlobalService) { }

}
