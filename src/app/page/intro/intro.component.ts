import { Component } from '@angular/core'
import { DataService } from 'src/app/data.service'

@Component({
  selector: 'vii-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.less']
})
export class IntroComponent {

  constructor(public data : DataService) { }

}
