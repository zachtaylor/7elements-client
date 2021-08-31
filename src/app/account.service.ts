import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Deck, Account } from './api'
import { CookieService } from './cookie.service'
import { RouterService } from './router.service'
import { WebsocketService } from './websocket.service'

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  username : string

  email : string

  coins : number

  cards : Map<number, number>

  decks : Map<number, Deck>

  // data : MyAccount

  update$ = new BehaviorSubject<Account>(null)

  constructor(private cookies : CookieService, private router : RouterService, private ws : WebsocketService) {
    this.reset()
    this.ws.routes.set('/myaccount', data => { this.serveMyAccount(data) })
    this.ws.routes.set('/myaccount/game', data => { this.serveMyAccountGame(data) })
  }

  private reset() {
    this.username = ''
    this.email = ''
    this.coins = 0
    this.cards = new Map<number, number>()
    this.decks = new Map<number, Deck>()
  }

  private serveMyAccount(data) {
    if (data && data.username) {
      // this.data = data
      this.username = data.username
      this.email = data.email
      this.coins = data.coins
      this.cards = data.cards
      this.decks = data.decks
      if (this.cookies.allow) {
        this.cookies.set('SessionID', data.session, 1, undefined, window.location.protocol == 'https:', 'strict')
      }
      // .message('vii', 'account', 'updated', '', 3000)
      console.debug('/myaccount', data.username, data.session, data)
    } else {
      console.debug('/myaccount: remove')
      this.reset()
      this.cookies.delete('SessionID')
      this.router.goto('/')
    }
    this.update$.next(data)
  }
  private serveMyAccountGame(data) {
    console.debug('/myaccount/game', data.game)
    let account = this.update$.value // this.data
    if (account) {
      account.game = data.game
      this.update$.next(account)
    } else {
      console.warn('account missing')
    }
  }
}
