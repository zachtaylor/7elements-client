import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Account, GlobalData, NewGameSettings, PingData, Queue } from './api'
import { CookieService } from './cookie.service'
import { WebsocketService } from './websocket.service'

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
    this.http.get<GlobalData>(`/api/global.json`).subscribe(glob => { this.onGlobalJson(glob) })
    this.ws.routes.set('/ping', data => { this.servePing(data) })
    this.ws.routes.set('/myaccount', data => { this.serveAccount(data) })
    this.ws.routes.set('/queue', data => { this.serveQueue(data) })
    if (this.cookies.allow) this.loadCookies()
  }

  private loadCookies() {
    this.loadNewGameSettingsCookies()
  }
  
  private loadNewGameSettingsCookies() {
    let deckid = +this.cookies.get('newgamedeckid')
    let owner = this.cookies.get('newgameowner')
    let pvp = this.cookies.get('newgamepvp') === '1'
    let custom = this.cookies.get('newgamecustom') === '1'
    if (owner !== 'vii') {
      custom = true
    }
    let hands = this.cookies.get('newgamehands')
    let speed = this.cookies.get('newgamespeed')
    this.newgamesettings$.next(new NewGameSettings(deckid, owner, pvp, hands, speed))
  }

  private setNewGameSettingsCookies() {
    let newgamesettings = this.newgamesettings$.value
    this.cookies.set('newgamedeckid', ''+newgamesettings.deckid, 30)
    this.cookies.set('newgameowner', newgamesettings.owner, 30)
    this.cookies.set('newgamepvp', newgamesettings.pvp ? '1' : '0', 30)
    this.cookies.set('newgamehands', newgamesettings.hands, 30)
    this.cookies.set('newgamespeed', newgamesettings.speed, 30)
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

  private serveQueue(data) {
    console.debug('queue', data)
    this.queue$.next(data)
  }

  private setSessionCookie(session: string) {
    this.cookies.set('SessionID', session, 1, undefined, window.location.protocol == 'https:', 'strict')
  }

  setNewGameSettings(deckid: number, owner: string, pvp: boolean, hands: string, speed: string) {
    this.newgamesettings$.next(new NewGameSettings(deckid, owner, pvp, hands, speed))
    if (this.cookies.allow) this.setNewGameSettingsCookies()
  }

}
