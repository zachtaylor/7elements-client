import { Component } from '@angular/core'
import { DataService } from 'src/app/data.service'

@Component({
  selector: 'vii-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.less']
})
export class CardsComponent {

  constructor(public data : DataService) { }

}
