import { Injectable } from '@angular/core'
import { Router, Event, NavigationEnd } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  path = '/'

  constructor(private router: Router) {
    this.router.events.subscribe(e => { this.onEvent(e)})
  }

  private onEvent(e : Event) {
    if (e instanceof NavigationEnd) {
      this.path = window.location.pathname
      document.getElementsByTagName('vii-route')[0].scrollTop = 0
    }
  }

  goto(url: string) {
    console.debug('goto', url)
    this.router.navigateByUrl(url)
  }

}
