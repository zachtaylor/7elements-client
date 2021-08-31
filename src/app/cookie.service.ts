import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  allow = false

  // https://stackoverflow.com/questions/34298133/angular-cookies
  constructor() {
    this.allow = this.get('allow') === '1'
    if (this.allow) console.debug('enabled')
  }

  // private load() {
  //   let deckid = +this.get('deckid'), deckuser = this.get('deckuser')
  //   if (deckid > 0 && deckuser.length > 0) {
  //     this.deckid = deckid
  //     this.deckuser = deckuser
  //   }
  // }

  get(name: string) {
    let ca = document.cookie.split(';')
    let caLen = ca.length
    let cookieName = `${name}=`
    let c: string

    for (let i: number = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '')
        if (c.indexOf(cookieName) == 0) {
            return c.substring(cookieName.length, c.length)
        }
    }
    return ''
  }
 
  set(name: string, value: string, expireDays: number, path: string = "", secure?: boolean, sameSite?: 'lax' | 'strict' | 'none') {
    let d = new Date()
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000)
    let expires = "expires=" + d.toUTCString()
    let cookie = name + "=" + value + "; " + expires + (path.length > 0 ? "; path=" + path : "") + (secure ? "; secure" : "") + (sameSite ? "; samesite=" + sameSite : "; samesite=lax")
    document.cookie = cookie
  }

  delete(name: string) {
    this.set(name, '', -1)
  }

  consent() {
    this.set('allow', '1', 30)
    this.allow = true
  }

}
