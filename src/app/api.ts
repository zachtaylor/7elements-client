export class Account {
  username: string
  email: string
  coins: number
  cards: Map<number, number>
  decks: Map<number, Deck>
  game: string

  constructor() {
    this.username=''
    this.email=''
    this.coins=0
    this.cards = new Map<number, number>()
    this.decks = new Map<number, Deck>()
    this.game = ''
  }
}

export class Card {
  id: number
  name: string
  text: string
  image: string
  type: string
  costs: Map<number, number>
  body?: {
    attack: number
    health: number
  }
  powers: Map<number, Power>
  constructor(data: any) {
    if (!data) return
    if (data.id) this.id = data.id
    if (data.name) this.name = data.name
    if (data.text) this.text = data.text
    if (data.image) this.image = data.image
    if (data.type) this.type = data.type
    if (data.costs) this.costs = data.costs
    if (data.body) this.body = data.body
    if (data.powers) this.powers = data.powers
  }
  // enoughkarma(karma: Map<number, number>) : boolean {
  //   let karmacount = new ElementCount(karma)
  //   return karmacount.test(this.costs)
  // }
}

export class Deck {
  id: number
  name: string
  size: number
  cover: number
  cards: Map<number, number>
}

export class DeckEditing {
  name: string
  cover: number
  cards: Map<number, number>
  constructor() {
    this.name=''
    this.cover=0
    this.cards = new Map<number, number>()
  }
}

export class Game {
  id: string
  stateid: string
  username: string
  seats: string[]
}

export class GameState {
  id: string
  name: string
  data: any
  seat: string
  timer: number
  reacts: Map<string, string>
  stack: string
  parent: string
  child: string
}

export class GameSeat {
  username: string
  elements: Map<number, Array<boolean>>
  hand: number
  future: number
  life: number
  color: string

  constructor(username : string) {
    this.username = username
    this.elements = new Map<number, Array<boolean>>()
  }
}

export class GameCard {
  id: string
  cardid: number
  user: string
}

export class GameToken {
  id: string
  awake: boolean
  cardid: number
  name: string
  user: string
  text: string
  powers: Array<Power>
  body?: {
    attack: number
    health: number
  }
  type: string
}

export class Pack {
  id: number
  name: string
  size: number
  cost: number
  cards: number[]
}

export class Power {
  id: number
  text: string
  costs: Map<number, number>
  trigger: string
  usesturn: boolean
  useskill: boolean
  target: string
}

// export class ChatSetting {
//   off: boolean
//   hideT: number
//   constructor() {
//     this.off = false
//     this.hideT = 7000
//   }
// }

export class GlobalData {
  cards: Array<Card>
  decks: Map<number, Deck>
  packs: Array<Pack>
  users: number
  constructor() {
    this.cards = []
    this.decks = new Map<number, Deck>()
    this.packs = []
    this.users = 0
  }
}

export class PingData {
  ping: number
  users: number
  online: number
}

export class ElementCount {
  items: Map<number, number>
  constructor(items? : Map<number, number>) {
    if (items) {
      this.items = items
    } else {
      this.items = new Map<number, number>()
    }
  }
  length() : number {
    let length = 0, keys = Object.keys(this.items)
    for (let i = 0; i < keys.length; i++) {
      length += this.items.get(+keys[i])
    }
    return length
  }
  test(costs: object) : boolean {
    let ok = true
    let count = new Map<number, number>()
    Object.keys(costs).forEach(el => {
      let element = +el
      if (element==0) {
      } else if (this.items.get(element) < costs[element]) {
        ok = false
      } else {
        count.set(element, costs[element])
      }
    })
    // guarantees costs where el==0
    let countcosts = new ElementCount(count)
    return this.length() >= countcosts.length()
  }
}

export class Message {
  source: string
  channel: string
  message: string
  time: string

  constructor(source : string, channel : string, message : string, time : string) {
    this.source = source
    this.channel = channel
    this.message = message
    this.time = time
  }
}

export class DeckSetting {
  user: string
  id: number
  constructor(user = 'vii', id = 1) {
    this.user = user
    this.id = id
  }
}

export class QueueSetting {
  pvp: boolean
  custom: boolean
  hands: string
  speed: string
  constructor(pvp = false, custom = false, hands = 'med', speed = 'slow') {
    this.pvp = pvp
    this.custom = custom
    this.hands = hands
    this.speed = speed
  }
}

export class GameMenu {
  title: string // text
  target: string  // targeting enum
  targetF: any // this func procs for 'target' selection
  token: GameToken
  card: GameCard
  choices: Array<GameMenuChoice> // offered choices
  stack: GameMenu
  important: boolean // hides the close button

  constructor(title: string, stack: GameMenu) {
    this.title=title
    this.choices = []
    this.stack = stack
  }

  show() : boolean {
    if (this.title) {
      return true
    } else if (this.target) {
      return true
    } else if (this.token != null) {
      return true
    } else if (this.card != null) {
      return true
    } 
    return false
  }
}

export class GameMenuChoice {
  choice: string
  display: string
}

export class KarmaPlanner {
  plan: object
  free: object

  constructor(plan : object, free : object) {
    this.plan = plan
    this.free = free
  }

  multiply() : Array<KarmaPlanner> {
    let me = this
    let a = new Array<KarmaPlanner>()
    console.log(this.free, Object.keys(this.free))
    Object.keys(this.free).forEach(el => {
      let element = +el
      let freecount = me.free[element]
      console.log('use free', element)

      if (!freecount || freecount < 1) { return }

      let newplan = me.copy(me.plan)
      if (newplan[element]) {
        newplan[element] = newplan[element] + 1
      } else {
        newplan[element] = 1
      }
      let newfree = me.copy(me.free)
      newfree[element] = freecount-1
      a.push(new KarmaPlanner(newplan, newfree))
    })
    return a
  }

  private copy(plan : object) : object {
    let copy = {}
    Object.keys(plan).forEach(k => {
      copy[k] = plan[k]
    })
    return copy
  }
}
