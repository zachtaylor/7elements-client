import { Component } from '@angular/core'
import { DataService } from 'src/app/data.service'
import { RuntimeService } from 'src/app/runtime.service'

@Component({
  selector: 'vii-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.less']
})
export class DecksComponent  {

  constructor(
    public runtime : RuntimeService,
    public data : DataService,
  ) { }

}
