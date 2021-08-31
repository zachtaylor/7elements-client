import { Component } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { WebsocketService } from 'src/app/websocket.service'

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

  constructor(private ws : WebsocketService) { }

  submit() {
    if (!this.form.valid) { return console.debug('form invalid: ', this.form) }

    this.ws.send('/login', {
      username:this.form.get('username').value,
      password:this.form.get('password').value
    })
  }

}
