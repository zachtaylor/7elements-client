import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Card, Deck, GlobalData, Pack } from './api'

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  data : GlobalData

  update$ = new BehaviorSubject<GlobalData>(null)

  cards : Card[] = []

  decks = new Map<number, Deck>()

  packs : Pack[] = []

  constructor(private http : HttpClient) {
    this.http.get<GlobalData>(`/api/global.json`).subscribe(glob => { this.onGlobalJson(glob) })
  }

  private onGlobalJson(glob : GlobalData) {
    console.debug('resolve', glob)
    this.data = glob
    this.cards = glob.cards
    this.decks = glob.decks
    this.packs = glob.packs
    this.update$.next(this.data)
  }

}
