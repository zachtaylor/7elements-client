import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Account, GlobalData, PingData } from './api'
import { CookieService } from './cookie.service'
import { WebsocketService } from './websocket.service'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  global$ = new BehaviorSubject<GlobalData>(new GlobalData())

  ping$ = new BehaviorSubject<PingData>(null)

  account$ = new BehaviorSubject<Account>(new Account())

  constructor(
    private http : HttpClient,
    private cookies : CookieService,
    private ws : WebsocketService,
  ) {
    this.http.get<GlobalData>(`/api/global.json`).subscribe(glob => { this.onGlobalJson(glob) })
    this.ws.routes.set('/ping', data => { this.servePing(data) })
    this.ws.routes.set('/myaccount', data => { this.serveAccount(data) })
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
      if (this.cookies.allow) {
        this.setSessionCookie(data.session)
      }
    } else {
      this.account$.next(new Account())
      this.cookies.delete('SessionID')
    }
  }

  private setSessionCookie(session: string) {
    this.cookies.set('SessionID', session, 1, undefined, window.location.protocol == 'https:', 'strict')
  }

}
