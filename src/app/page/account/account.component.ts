import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { AccountService } from 'src/app/account.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {
  private hash = ''

  changeEmail = new FormGroup({
    email: new FormControl(''),
  })

  changePassword = new FormGroup({
    password1: new FormControl(''),
    password2: new FormControl(''),
  })

  constructor(
    public route : ActivatedRoute,
    public account : AccountService,
    private ws : WebsocketService,
  ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(hash => { this.hash = hash })
  }

  showLogin() : boolean {
    return this.hash == 'login'
  }
  showSignup() : boolean {
    return this.hash == 'signup'
  }
  showLost() : boolean {
    return this.hash != 'login' && this.hash != 'signup'
  }

  clickLogout() {
    this.ws.send('/logout', {})
  }
  
  submitChangeEmail() {
    let inputEmail = this.changeEmail.get('email')
    let newEmail = inputEmail.value
    inputEmail.setValue('')
    this.ws.send('/email', {
      email:newEmail
    })
  }

  submitChangePassword() {
    let inputPassword1 = this.changePassword.get('password1')
    let inputPassword2 = this.changePassword.get('password2')
    let newPassword1 = inputPassword1.value
    let newPassword2 = inputPassword1.value
    inputPassword1.setValue('')
    inputPassword2.setValue('')
    this.ws.send('/password', {
      password1:newPassword1,
      password2:newPassword2,
    })
  }

}
