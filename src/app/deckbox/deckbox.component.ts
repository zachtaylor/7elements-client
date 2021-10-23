import { Component, HostBinding, Input } from '@angular/core'
import { Deck } from '../api'

@Component({
  selector: 'vii-deckbox',
  templateUrl: './deckbox.component.html',
  styleUrls: ['./deckbox.component.less']
})
export class DeckboxComponent {

  @Input() deck : Deck

  @HostBinding('class.active')
  isActive : boolean = false

  constructor() { }

}
