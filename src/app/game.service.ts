// import { Injectable } from '@angular/core'
// import { BehaviorSubject } from 'rxjs'
// import { GameCard, GameMenu, GameMenuChoice, GameSeat, GameState, GameToken } from './api'
// import { RouterService } from './router.service'
// import { WebsocketService } from './websocket.service'

// @Injectable({
//   providedIn: 'root'
// })
// export class GameService {

//   id : string

//   username : string

//   stateid : string

//   hand$ = new BehaviorSubject<string[]>([])

//   menu$ = new BehaviorSubject<GameMenu>(null)

//   private cards = new Map<string, BehaviorSubject<GameCard>>()

//   private tokens = new Map<string, BehaviorSubject<GameToken>>()

//   private states = new Map<string, BehaviorSubject<GameState>>()

//   private seats = new Map<string, BehaviorSubject<GameSeat>>()

//   private present = new Map<string, BehaviorSubject<string[]>>()

//   private past = new Map<string, BehaviorSubject<string[]>>()

//   constructor(private ws : WebsocketService, private router : RouterService) {
//     let me = this
//     setTimeout(() => { me.wsroutes() })
//   }

//   private wsroutes() {
//     this.ws.routes.set('/game', data => { this.serveGame(data) })
//     this.ws.routes.set('/game/hand', data => { this.serveGameHand(data) })
//     this.ws.routes.set('/game/card', data => { this.serveGameCard(data) })
//     this.ws.routes.set('/game/token', data => { this.serveGameToken(data) })
//     this.ws.routes.set('/game/present', data => { this.serveGamePresent(data) })
//     this.ws.routes.set('/game/state', data => { this.serveGameState(data) })
//     this.ws.routes.set('/game/seat', data => { this.serveGameSeat(data) })
//     this.ws.routes.set('/game/react', data => { this.serveGameReact(data) })
//   }

//   private serveGame(data) {
//     if (!data) {
//       this.id = ''
//       return
//     }
//     console.debug('/game', data.id, data.username, data.stateid)
//     this.id = data.id
//     this.stateid = data.stateid
//     this.username = data.username
//     if (this.router.path != '/play') this.router.goto('/play')
//     if (data.seats && data.seats.length) {
//       for (let i = 0; i < data.seats.length; i++) {
//         let username = data.seats[i]
//         let seat$ = this.seat$(username)
//         if (!seat$.value) {
//           seat$.next(new GameSeat(username))
//         }
//       }
//     } else {
//       console.warn('seats missing', data)
//     }
//   }

//   private serveGameHand(data) {
//     console.debug('/game/hand', data.cards)
//     this.hand$.next(data.cards)
//   }

//   private serveGameCard(data) {
//     console.debug('/game/card', data.id, data.name)
//     this.card$(data.id).next(data)
//   }

//   private serveGameToken(data) {
//     console.debug('/game/token', data.id, data.name, data.user)
//     this.token$(data.id).next(data)
//   }

//   private serveGamePresent(data) {
//     console.debug('/game/present', data.username, data.present)
//     if (!data) { return }
//     let present$ = this.present$(data.username)
//     if (data.present && data.present.length) { present$.next(data.present) }
//     else { console.warn('present missing', data) }
//   }

//   private serveGameSeat(data: any) {
//     console.debug('/game/seat', data.username)
//     let seat$ = this.seat$(data.username)
//     if (!seat$.value) { return }
//     let seat = seat$.value
//     if (seat.life !== data.life) { seat.life = data.life }
//     if (seat.hand !== data.hand) { seat.hand = data.hand }
//     if (seat.future !== data.future) { seat.future = data.future }
//     if (data.present) { this.past$(seat.username).next(data.present) }
//     if (data.past) { this.past$(seat.username).next(data.past) }
//     for (let i = 1; i < 8; i++) {
//       // console.debug('/game/seat/elements', i, data.elements[i])
//       let elLights = data.elements[i]
//       if ((!elLights) || (!elLights.length)) { continue }
//       seat.elements[i] = elLights
//     }
//     seat$.next(seat)
//     this.present$(seat.username).next(data.present)
//   }

//   private serveGameState(data) {
//     console.debug('/game/state', data.id, data.name, data.seat)
//     // this.state$.next(data)
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

//   private serveGameReact(data: any) {
//     console.debug('/game/react', data.stateid, data.username, data.react)
//     let state$ = this.state$(data.stateid)
//     let state = state$.value
//     if (state.reacts[data.username]) return;
//     state.reacts[data.username] = data.react
//     state$.next(state)
//   }

//   // public
  
//   opponents() : string[] {
//     let me = this.username
//     let opponents = []
//     this.seats.forEach(function(seat$, name) {
//       if (name != me) opponents.push(name)
//     })
//     return opponents
//   }

//   state$(id : string) : BehaviorSubject<GameState> {
//     let state = this.states.get(id)
//     if (!state) {
//       state = new BehaviorSubject<GameState>(null)
//       this.states.set(id, state)
//     }
//     return state
//   }

//   card$(id: string) : BehaviorSubject<GameCard> {
//     let card = this.cards.get(id)
//     if (!card) {
//       card = new BehaviorSubject<GameCard>(null)
//       this.cards.set(id, card)
//     }
//     return card
//   }

//   token$(id: string) : BehaviorSubject<GameToken> {
//     let token = this.tokens.get(id)
//     if (!token) {
//       token = new BehaviorSubject<GameToken>(null)
//       this.tokens.set(id, token)
//     }
//     return token
//   }

//   seat$(name : string) : BehaviorSubject<GameSeat> {
//     let seat = this.seats.get(name)
//     if (!seat) {
//       seat = new BehaviorSubject<GameSeat>(null)
//       this.seats.set(name, seat)
//     }
//     return seat
//   }

//   present$(name : string) : BehaviorSubject<string[]> {
//     let present = this.present.get(name)
//     if (!present) {
//       present = new BehaviorSubject<string[]>([])
//       this.present.set(name, present)
//     }
//     return present
//   }

//   past$(name : string) : BehaviorSubject<string[]> {
//     let past = this.past.get(name)
//     if (!past) {
//       past = new BehaviorSubject<string[]>([])
//       this.past.set(name, past)
//     }
//     return past
//   }

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

// }
