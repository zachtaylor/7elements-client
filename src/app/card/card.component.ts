import { Component, HostBinding, Input } from '@angular/core'
import { Card } from '../api'

@Component({
  selector: 'vii-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent {
  @Input() card : Card
  
  // change background color
  @HostBinding('class.white') private get isWhite() {
    return this.card && this.card.costs[1] > 0
  }
  @HostBinding('class.red') private get isRed() {
      return this.card && this.card.costs[2] > 0
  }
  @HostBinding('class.yellow') private get isYellow() {
      return this.card && this.card.costs[3] > 0
  }
  @HostBinding('class.green') private get isGreen() {
      return this.card && this.card.costs[4] > 0
  }
  @HostBinding('class.blue') private get isBlue() {
      return this.card && this.card.costs[5] > 0
  }
  @HostBinding('class.violet') private get isViolet() {
      return this.card && this.card.costs[6] > 0
  }
  @HostBinding('class.black') private get isBlack() {
      return this.card && this.card.costs[7] > 0
  }

  constructor() { }

}
