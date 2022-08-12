import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { CookieService } from 'src/app/cookie.service'
import { WebsocketService } from 'src/app/websocket.service'
import { environment } from 'env'

@Component({
  selector: 'vii-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })

  constructor(
    private cookies : CookieService,
    private ws : WebsocketService) { }

  submit() {
    if (!this.form.valid) { return }
    if (!this.cookies.allow) { return alert('please accept cookies') }

    this.ws.send('/login', {
      username:this.form.get('username').value,
      password:this.form.get('password').value
    })
  }

}
