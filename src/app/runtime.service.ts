import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { DeckSetting, QueueSetting } from './api'
import { CookieService } from './cookie.service'

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  deck$ = new BehaviorSubject<DeckSetting>(new DeckSetting())

  queue$ = new BehaviorSubject<QueueSetting>(new QueueSetting())

  constructor(private cookies : CookieService) {
    if (this.cookies.allow) this.loadCookies()
  }

  private loadCookies() {
    this.loadDeckCookies()
    this.loadQueueCookies()
  }

  private loadDeckCookies() {
    let deckuser = this.cookies.get('deckuser')
    let deckid = +this.cookies.get('deckid')
    this.setDeck(deckuser, deckid)
  }

  private loadQueueCookies() {
    let queuepvp = this.cookies.get('queuepvp') === '1'
    let queuecustom = this.cookies.get('queuecustom') === '1'
    if (this.deck$.value.user !== 'vii') {
      queuecustom = true
    }
    let queuehands = this.cookies.get('queuehands')
    let queuespeed = this.cookies.get('queuespeed')
    this.setQueue(queuepvp, queuecustom, queuehands, queuespeed)
  }

  private setDeckCookies() {
    let deck = this.deck$.value
    this.cookies.set('deckid', ''+deck.id, 30)
    this.cookies.set('deckuser', deck.user, 30)
  }

  private setQueueCookies() {
    let queue = this.queue$.value
    this.cookies.set('queuepvp', queue.pvp ? '1' : '0', 30)
    this.cookies.set('queuecustom', queue.custom ? '1' : '0', 30)
    this.cookies.set('queuehands', queue.hands, 30)
    this.cookies.set('queuespeed', queue.speed, 30)
  }

  private forceQueueCustom() {
    let old = this.queue$.value
    if (!old.custom) {
      this.queue$.next(new QueueSetting(old.pvp, true, old.hands, old.speed))
    }
  }
  private unforceQueueCustom() {
    if (this.cookies.allow && this.cookies.get('queuecustom') !== '1') {
      let old = this.queue$.value
      this.queue$.next(new QueueSetting(old.pvp, false, old.hands, old.speed))
    }
  }

  setDeck(user: string, id: number) {
    console.debug('set deck', user, id)
    this.deck$.next(new DeckSetting(user, id))
    if (this.cookies.allow) this.setDeckCookies()
    if (user !== 'vii') this.forceQueueCustom()
    else this.unforceQueueCustom()
  }

  setQueue(pvp: boolean, custom: boolean, hands: string, speed: string) {
    console.debug('set queue', pvp, custom, hands, speed)
    this.queue$.next(new QueueSetting(pvp, custom, hands, speed))
    if (this.cookies.allow) this.setQueueCookies()
  }

}
