import { Component, OnDestroy, OnInit } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { Deck, DeckEditing } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class DeckEditComponent implements OnInit, OnDestroy {
  id: number
  private $id: Subscription

  form = new UntypedFormGroup({
    name: new UntypedFormControl(''),
  })
  private $formUpdate: Subscription

  edits = new DeckEditing()

  constructor(
    private route: ActivatedRoute,
    public data: DataService,
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

  private get deck(): Deck {
    return this.data.account$.value.decks[this.id]
  }

  get dirty(): boolean {
    return this.edits.name.length > 0 || this.edits.cover > 0 || this.edits.cards.size > 0
  }
  
  get coverImage(): number {
    return this.edits.cover > 0 ? this.edits.cover : this.deck.cover
  }

  // view to state 

  private updateForm() {
    let val = this.form.get('name').value
    if (val == this.deck.name) {
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
    let saved = this.deck.cards[cardid]
    if (saved > 0) return saved
    return 0
  }

  getCards() {
    let obj = {}
    for (let key of this.edits.cards.keys()) {
      obj[key] = true
    }
    for (let key of Object.keys(this.deck.cards)) {
      obj[key] = true
    }
    return Object.keys(obj)
  }

  getCount(): number {
    let count = this.deck.size
    this.edits.cards.forEach(val => {
      count += val
    })
    return count
  }

  // button handlers

  clickUp(cardid: number) {
    let diff = this.diffCardID(cardid)
    let count = this.savedCardID(cardid) + diff
    if (count + 1 === this.deck.cards[cardid]) {
      this.edits.cards.delete(cardid)
    } else if (count + 1 <= this.data.account$.value.cards[cardid]) {
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
    if (cardid===this.deck.cover) {
      this.edits.cover = 0
    } else {
      this.edits.cover=cardid
    }
  }
  clickSave() {
    let obj = { id: this.id }
    if (this.edits.name.length > 0 && this.edits.name!==this.deck.name) { obj["name"] = this.edits.name }
    if (this.edits.cards.size > 0) { obj["cards"] = this.edits.cards }
    if (this.edits.cover > 0) { obj["cover"] = this.edits.cover }
    this.edits = new DeckEditing()
    this.ws.send('/deck', obj)
  }

}
