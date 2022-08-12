import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree
} from '@angular/router'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Account } from './api';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  is$ = new BehaviorSubject(false)
  private $admin: Subscription

  constructor(
    private data: DataService
  ) {
    this.$admin = data.account$.subscribe(account => {
      this.is$.next(this.check(account))
    })
  }

  private check(account: Account): boolean {
    console.log('check admin', account)
    return account?.username == 'zach'
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
    return this.is$
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
    return this.is$
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.is$
  }
}
