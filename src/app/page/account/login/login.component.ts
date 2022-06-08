import { Component } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms'
import { CookieService } from 'src/app/cookie.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  form = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
  })

  constructor(private cookies : CookieService, private ws : WebsocketService) { }

  submit() {
    if (!this.form.valid) { return }
    if (!this.cookies.allow) { return alert('please accept cookies') }

    this.ws.send('/login', {
      username:this.form.get('username').value,
      password:this.form.get('password').value
    })
  }

}
