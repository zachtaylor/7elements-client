import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { PingData } from './api'
import { RouterService } from './router.service'

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  ping$ = new BehaviorSubject<PingData>(null)

  private ws: WebSocket

  routes = new Map<string, any>()

  constructor(private router : RouterService) {
    this.setRoutes()
    let me = this
    setTimeout(() => { me.start() })
  }

  private setRoutes() {
    this.routes.set('/ping', data => { this.servePing(data) })
    this.routes.set('/chat/message', data => { this.serveChatMessage(data) })
    this.routes.set('/chat/join', data => { this.serveChatJoin(data) })
    this.routes.set('/redirect', data => { this.serveRedirect(data) })
    this.routes.set('/error', data => { this.serveError(data) })
  }

  private start() {
    this.ws = new WebSocket(window.location.protocol.replace('http', 'ws') + window.location.host + '/api/websocket')
    this.ws.onopen = () => { 
      console.debug('opened')
    }
    this.ws.onmessage = msg => { 
      if (msg.data instanceof Blob) {
        this.receiveBlob(msg)
      } else {
        this.receiveRaw(msg)
      }
    }
    this.ws.onclose = err => { 
      console.warn('lost', err)
      this.router.goto('/lost')
    }
  }

  private parse(data) {
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('parse', data, e)
      return false
    }
  }

  private receiveBlob(msg) {
    let reader = new FileReader()
    reader.onload = () => {
      let data = this.parse(reader.result.toString())
      if (data) { this.serve(data) }
      else { console.error('receive blob', data) }
    }
    reader.readAsText(msg.data)
  }
  private receiveRaw(msg) {
    let data = this.parse(msg.data.toString())
    if (data) this.serve(data)
    else console.error('receive raw', msg.data)
  }

  private serve(msg) {
    let uri = msg.uri
    if (!uri) {
      console.warn('received no uri', msg)
      return
    }
    let data = msg.data
    // console.debug('received', uri)
    let route = this.routes.get(uri)
    if (!route) console.warn('received unknown uri', uri, data)
    else route(data)
  }

  // services

  private servePing(data) {
    if (!data || !data.ping) {
      console.debug('ping no data', data)
    } else {
      console.debug('ping data', data)
      this.ping$.next(data)
    }
  }
  private serveChatMessage(data) {
    console.debug('chat message', data.username, data.channel, data.message)
    // let msgs = this.chat$(data.channel).value.slice()
    // let msg = new Message(data.username, data.channel, data.message, data.time)
    // msgs.unshift(msg)
    // this.chat$(data.channel).next(msgs)
    // this.message(msg.source, msg.channel, msg.message, msg.time, 10000)
  }
  private serveChatJoin(data) {
    console.debug('chat join', data.channel)
    // this.chat$(data.channel).next(data)
  }

  private serveRedirect(data) {
    console.debug('/redirect', data.location)
    this.router.goto(data.location)
  }

  private serveError(data) {
    console.log('/error', data.source, data.error)
    // this.message('vii', data.source, data.error, '', 7000)
  }

  // helper

  private replacer(key, value) {
    if(value instanceof Map) {
      let obj = {}
      value.forEach((val, key) => {
        obj[key] = val
      })
      return obj
    } else return value
  }

  // public

  send(uri: string, data: object) {
    let msg = JSON.stringify({
      'uri': uri,
      'data': data
    }, this.replacer)
    console.debug('send', msg)
    this.ws.send(msg)
  }

}
