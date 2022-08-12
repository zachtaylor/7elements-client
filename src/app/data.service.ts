import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Account, GlobalData, NewGameSettings, PingData, Queue } from './api'
import { CookieService } from './cookie.service'
import { WebsocketService } from './websocket.service'
import { environment } from 'env'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  global$ = new BehaviorSubject<GlobalData>(new GlobalData())

  newgamesettings$ = new BehaviorSubject<NewGameSettings>(new NewGameSettings())

  ping$ = new BehaviorSubject<PingData>(null)

  account$ = new BehaviorSubject<Account>(new Account())

  queue$ = new BehaviorSubject<Queue>(null)

  constructor(
    private http : HttpClient,
    private cookies : CookieService,
    private ws : WebsocketService,
  ) {
    this.http.get<GlobalData>(window.location.protocol + '//' + environment.apiHostname + `/global.json`).subscribe(glob => { this.onGlobalJson(glob) })
    this.ws.routes.set('/ping', data => { this.servePing(data) })
    this.ws.routes.set('/myaccount', data => { this.serveAccount(data) })
    this.ws.routes.set('/game/queue', data => { this.serveGameQueue(data) })
    this.loadLocalStorage()
  }

  private loadLocalStorage() {
    this.loadNewGameSettings()
  }

  private loadNewGameSettings() {
    let useSettings = +localStorage.getItem('newgamesettings')
    if (!useSettings) return
    let deckid = +localStorage.getItem('newgamedeckid')
    let owner = localStorage.getItem('newgameowner')
    let pvp = localStorage.getItem('newgamepvp') === '1'
    let custom = localStorage.getItem('newgamecustom') === '1'
    if (owner !== 'vii') {
      custom = true
    }
    let hands = localStorage.getItem('newgamehands')
    let speed = localStorage.getItem('newgamespeed')
    this.newgamesettings$.next(new NewGameSettings(deckid, owner, pvp, hands, speed))
  }

  private onGlobalJson(glob : GlobalData) {
    console.debug('global', glob)
    this.global$.next(glob)
  }

  private servePing(ping) {
    console.debug('ping', ping)
    this.ping$.next(ping)
  }

  private serveAccount(data) {
    console.debug('account', data)
    if (data) {
      this.account$.next(data)
      if (this.cookies.allow) this.setSessionCookie(data.session)
    } else {
      this.account$.next(new Account())
      this.cookies.delete('SessionID')
    }
  }

  private serveGameQueue(data) {
    console.debug('queue', data)
    this.queue$.next(data)
  }

  private setSessionCookie(session: string) {
    this.cookies.set('SessionID', session, 1, window.location.protocol == 'https:', 'strict')
  }

  setNewGameSettings(deckid: number, owner: string, pvp: boolean, hands: string, speed: string) {
    this.newgamesettings$.next(new NewGameSettings(deckid, owner, pvp, hands, speed))
    localStorage.setItem('newgamesettings', '1')
    localStorage.setItem('newgamedeckid', ''+deckid)
    localStorage.setItem('newgameowner', owner)
    localStorage.setItem('newgamepvp', pvp ? '1' : '0')
    localStorage.setItem('newgamehands', hands)
    localStorage.setItem('newgamespeed', speed)
  }

}
