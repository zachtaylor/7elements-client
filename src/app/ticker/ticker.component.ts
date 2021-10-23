import { Component, Input, OnInit } from '@angular/core'
import { BehaviorSubject, interval, Subscription } from 'rxjs'

@Component({
  selector: 'vii-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.less']
})
export class TickerComponent implements OnInit {

  @Input()
  number: number

  @Input()
  down: boolean

  val$ = new BehaviorSubject<number>(0)

  private $ticker: Subscription

  constructor() { }

  ngOnInit(): void {
    this.val$.next(this.number)
    this.$ticker = interval(1000).subscribe(_ => {
      let val = this.val$.value
      if (this.down) {
        if (val > 0) this.val$.next(val - 1)
      } else {
        this.val$.next(val + 1)
      }
    })
  }

  ngOnDestroy(): void {
    this.$ticker.unsubscribe()
  }

}
