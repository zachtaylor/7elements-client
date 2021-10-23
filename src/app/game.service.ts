import { Injectable } from '@angular/core'
import { BehaviorSubject, defer } from 'rxjs'
import { GameCard, GameMenu, GameMenuChoice, GameSeat, GameState, GameToken, Queue } from './api'
import { RouterService } from './router.service'
import { WebsocketService } from './websocket.service'

@Injectable({
  providedIn: 'root'
})
export class GameService {

  id : string

  viewstate : string

  hand$ = new BehaviorSubject<string[]>([])

//   menu$ = new BehaviorSubject<GameMenu>(null)

  constructor(private ws : WebsocketService, private router : RouterService) {
    this.ws.routes.set('/game', data => { this.serveGame(data) })
    this.ws.routes.set('/game/hand', data => { this.serveGameHand(data) })
    this.ws.routes.set('/game/card', data => { this.serveGameCard(data) })
    this.ws.routes.set('/game/token', data => { this.serveGameToken(data) })
    this.ws.routes.set('/game/present', data => { this.serveGamePresent(data) })
    this.ws.routes.set('/game/state', data => { this.serveGameState(data) })
    this.ws.routes.set('/game/seat', data => { this.serveGameSeat(data) })
    this.ws.routes.set('/game/react', data => { this.serveGameReact(data) })
  }

  private serveGame(data) {
    console.debug('/game', data)
    if (!data) {
      this.id = ''
      return
    }
    this.id = data.id
    // this.stateid = data.stateid
    // this.username = data.username

    if (this.router.path != '/play') this.router.goto('/play')

    if (data.seats && data.seats.length) {
      for (let i = 0; i < data.seats.length; i++) {
        let username = data.seats[i]
        this.seat$(username) // ifndef creates
      }
    } else {
      console.warn('seats missing', data)
    }
  }

  private serveGameHand(data) {
    console.debug('/game/hand', data.cards)
    this.hand$.next(data.cards)
  }
  private serveGameCard(data) {
    console.debug('/game/card', data.id, data.name)
    this.card$(data.id).next(data)
  }
  private serveGameToken(data) {
    console.debug('/game/token', data.id, data.name, data.user)
    this.token$(data.id).next(data)
  }
  private serveGamePresent(data) {
    console.debug('/game/present', data.username, data.present)
    this.present$(data.username).next(data.present)
  }

  private serveGameSeat(data: any) {
    console.debug('/game/seat', data.username)
    let seat = new GameSeat(data.username)
    seat.hand = data.hand
    seat.present = data.present
    seat.future = data.future
    seat.past = data.past
    seat.life = data.life
    seat.color = data.color

    for (let i = 1; i < 8; i++) {
      let elrow = data.elements[i]
      if ((!elrow) || (!elrow.length)) { continue }
      seat.elements[i] = elrow
    }
    this.seat$(data.username).next(seat)
  }

  private serveGameState(data) {
    console.debug('/game/state', data.id, data.name, data.seat)
    let state$ = this.state$(data.id)
    let state = state$.value
    if (state.parent) {
      data.parent = state.parent
    }
    state$.next(data)

    if (data.stack) {
      let child$ = this.state$(data.stack)
      state = child$.value
      state.parent = data.id
      child$.next(state)
    }
  }

//   private serveGameState(data) {
//     this.state$(data.id).next(data)
//     if (data.stack) {
//       let child$ = this.state$(data.stack)
//       let child = child$.value
//       if (!child) {
//         console.warn('stack missing child', data.stack)
//         data.stack = null
//       } else {
//         child.parent = data.id
//         child$.next(child)
//       }
//     }
//     if (data.name == 'target' && data.seat == this.username) {
//       this.overlayTarget(data.data)
//     } else if (data.name == 'start' && !data.reacts[this.username]) {
//       this.overlayStart()
//     } else if (data.name == 'sunrise' && !data.reacts[this.username]) {
//       this.overlayNewElement()
//     } else if (data.name == 'choice' && data.seat == this.username && !data.reacts[this.username]) {
//       console.log(data.data)
//       this.overlay(data.data.choice, null, null, data.data.options)
//     } else {
//       this.menu$.next(null)
//     }
//   }

  private serveGameReact(data: any) {
    console.debug('/game/react', data.stateid, data.username, data.react)
    let state$ = this.state$(data.stateid)
    let state = state$.value
    if (state.reacts[data.username]) return;
    state.reacts[data.username] = data.react
    state$.next(state)
  }

//   // public
  
//   opponents() : string[] {
//     let me = this.username
//     let opponents = []
//     this.seats.forEach(function(seat$, name) {
//       if (name != me) opponents.push(name)
//     })
//     return opponents
//   }

  private state = new Map<string, BehaviorSubject<GameState>>()
  state$(id : string) : BehaviorSubject<GameState> {
    let state = this.state.get(id)
    if (!state) {
      state = new BehaviorSubject<GameState>(new GameState(id))
      this.state.set(id, state)
    }
    return state
  }

  private card = new Map<string, BehaviorSubject<GameCard>>()
  card$(id: string) : BehaviorSubject<GameCard> {
    let card = this.card.get(id)
    if (!card) {
      card = new BehaviorSubject<GameCard>(new GameCard(id))
      this.card.set(id, card)
    }
    return card
  }

  private token = new Map<string, BehaviorSubject<GameToken>>()
  token$(id: string) : BehaviorSubject<GameToken> {
    let token = this.token.get(id)
    if (!token) {
      token = new BehaviorSubject<GameToken>(new GameToken(id))
      this.token.set(id, token)
    }
    return token
  }

  private seat = new Map<string, BehaviorSubject<GameSeat>>()
  seat$(name : string) : BehaviorSubject<GameSeat> {
    let seat = this.seat.get(name)
    if (!seat) {
      seat = new BehaviorSubject<GameSeat>(new GameSeat(name))
      this.seat.set(name, seat)
    }
    return seat
  }

  private present = new Map<string, BehaviorSubject<string[]>>()
  present$(name : string) : BehaviorSubject<string[]> {
    let present = this.present.get(name)
    if (!present) {
      present = new BehaviorSubject<string[]>([])
      this.present.set(name, present)
    }
    return present
  }

  private past = new Map<string, BehaviorSubject<string[]>>()
  past$(name : string) : BehaviorSubject<string[]> {
    let past = this.past.get(name)
    if (!past) {
      past = new BehaviorSubject<string[]>([])
      this.past.set(name, past)
    }
    return past
  }

//   // overlay
  
//   private overlay(msg: string, card?: GameCard, token?: GameToken, choices?: Array<GameMenuChoice>) {
//     console.debug('overlay', msg, choices)
//     let menu = new GameMenu(msg, this.menu$.value)
//     if (card) menu.card = card
//     if (token) menu.token = token
//     if (choices) menu.choices = choices
//     this.menu$.next(menu)
//   }
//   private overlayStart() {
//     let overlay = new GameMenu('Starting Hand', null)
//     overlay.important = true
//     overlay.choices.push({
//       choice: 'keep',
//       display: '<label>Keep</label>'
//     })
//     overlay.choices.push({
//       choice: 'mulligan',
//       display: '<label>Mulligan</label>'
//     })
//     this.menu$.next(overlay)
//   }
//   private overlayNewElement() {
//     let overlay = new GameMenu('Create a new Element', null)
//     overlay.important = true
//     for (let i = 1; i < 8; i++) {
//       overlay.choices.push({
//         choice: ''+i,
//         display: '<img src="/img/icon/element-'+i+'.png">',
//       })
//     }
//     this.menu$.next(overlay)
//   }
//   private overlayTarget(data : any) {
//     console.debug('overlay target', data.text, data.target)
//     let me = this
//     let overlay = new GameMenu(data.text, null)
//     overlay.important = true
//     overlay.target = data.helper
//     overlay.targetF = val => {
//       me.ws.send('/game', {
//         'uri': me.stateid,
//         'target': val,
//       })
//     }
//     this.menu$.next(overlay)
//   }

}
