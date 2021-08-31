import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { GlobalService } from 'src/app/global.service'

@Component({
  selector: 'vii-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less']
})
export class DeckViewComponent implements OnInit, OnDestroy {
  id: number
  private $id: Subscription

  constructor(public glob : GlobalService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.$id = this.route.params.subscribe(params => {
       this.id = +params['id']
    })
  }

  ngOnDestroy() {
    this.$id.unsubscribe()
  }

}
