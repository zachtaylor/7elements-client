import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { AccountService } from 'src/app/account.service'
import { Account, DeckEditing } from 'src/app/api'
import { GlobalService } from 'src/app/global.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class DeckEditComponent implements OnInit, OnDestroy {
  id: number
  private $id: Subscription

  form = new FormGroup({
    name: new FormControl(''),
  })
  private $formUpdate: Subscription

  edits = new DeckEditing()

  constructor(
    private route: ActivatedRoute,
    public glob: GlobalService,
    public account: AccountService,
    private ws: WebsocketService,
  ) { }

  ngOnInit() {
    this.$id = this.route.params.subscribe(params => {
       this.id = +params['id']
    })
    this.$formUpdate = this.form.valueChanges.subscribe(() => {
      this.updateForm()
    })
  }

  ngOnDestroy() {
    this.$id.unsubscribe()
    this.$formUpdate.unsubscribe()
  }

  // view macros

  get dirty(): boolean {
    return this.edits.name.length > 0 || this.edits.cover > 0 || this.edits.cards.size > 0
  }
  
  get coverImage(): number {
    return this.edits.cover > 0 ? this.edits.cover : this.account.decks[this.id].cover
  }

  // view to state 

  private updateForm() {
    let val = this.form.get('name').value
    if (val == this.account.decks[this.id].name) {
      this.edits.name = ''
    } else {
      this.edits.name = val
    }
  }

  // state accessors

  diffCardID(cardid: number): number {
    let diff = this.edits.cards.get(cardid)
    if (diff < 0 || diff > 0) return diff
    return 0
  }

  savedCardID(cardid: number): number {
    let diff = this.account.decks[this.id].cards[cardid]
    if (diff < 0 || diff > 0) return diff
    return 0
  }

  getCards() {
    let obj = {}
    for (let key of this.edits.cards.keys()) {
      obj[key] = true
    }
    for (let key of Object.keys(this.account.decks[this.id].cards)) {
      obj[key] = true
    }
    return Object.keys(obj)
  }

  getCount(): number {
    let count = this.account.decks[this.id].size
    this.edits.cards.forEach(val => {
      count += val
    })
    return count
  }

  // button handlers

  clickUp(cardid: number) {
    let diff = this.diffCardID(cardid)
    let count = this.savedCardID(cardid) + diff
    if (count + 1 === this.account.decks[this.id].cards[cardid]) {
      this.edits.cards.delete(cardid)
    } else if (count + 1 <= this.account.cards[cardid]) {
      this.edits.cards.set(cardid, diff+1)
    }
  }
  clickDown(cardid: number) {
    let diff = this.diffCardID(cardid)
    let count = this.savedCardID(cardid) + diff
    if (diff === 1) {
      this.edits.cards.delete(cardid)
    } else if (count - 1 >= 0) {
      this.edits.cards.set(cardid, diff-1)
    }
  }
  clickCover(cardid: number) {
    if (cardid===this.account.decks[this.id].cover) {
      this.edits.cover = 0
    } else {
      this.edits.cover=cardid
    }
  }
  clickSave() {
    let obj = { id: this.id }
    if (this.edits.name.length > 0 && this.edits.name!==this.account.decks[this.id].name) { obj["name"] = this.edits.name }
    if (this.edits.cards.size > 0) { obj["cards"] = this.edits.cards }
    if (this.edits.cover > 0) { obj["cover"] = this.edits.cover }
    this.edits = new DeckEditing()
    this.ws.send('/deck', obj)
  }

}
