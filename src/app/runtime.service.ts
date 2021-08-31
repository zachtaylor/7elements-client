import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { DeckSetting } from './api'
import { CookieService } from './cookie.service'

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  deck$ = new BehaviorSubject<DeckSetting>(new DeckSetting())

  constructor(private cookies : CookieService) {
    if (this.cookies.allow) this.loadCookies()
  }

  private loadCookies() {
    this.setDeck(this.cookies.get('deckuser'), +this.cookies.get('deckid'))
  }

  private setCookies() {
    let deck = this.deck$.value
    this.cookies.set('deckid', ''+deck.id, 30)
    this.cookies.set('deckuser', deck.user, 30)
  }

  setDeck(user: string, id: number) {
    console.debug('set deck', user, id)
    this.deck$.next(new DeckSetting(user, id))
    if (this.cookies.allow) this.setCookies()
  }

}
