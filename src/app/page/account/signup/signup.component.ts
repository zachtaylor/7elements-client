import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms'
import { ValidatorService } from 'src/app/validator.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent {

  form = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ], this.validator.UsernameUnique()),
    email: new FormControl(''),
    password1: new FormControl(''),
    password2: new FormControl('',),
  }, this.validatePasswordMatch)

  constructor(private validator : ValidatorService, private ws : WebsocketService) { }

  get f() { return this.form.controls }

  showUsernameAvailable() : boolean {
    let f = this.f
    return !f.username.pristine && f.username.valid
  }
  showUsernamePending() : boolean {
    let f = this.f
    return !f.username.pristine && f.username.pending
  }
  showUsernameError() : boolean {
    let f = this.f
    return !f.username.pristine && f.username.invalid
  }
  showUsernameTaken() : boolean {
    let f = this.f
    return !f.username.pristine && f.username.invalid && f.username.errors.unique
  }
  // showUsernameEmpty() : boolean {
  //   return !this.f.username.pristine && this.f.username.invalid && this.f.username.errors.empty
  // }
  // showUsernameBanned() : boolean {
  //   if (this.f.username.pristine) return false
  //   return this.form.controls.username.errors && this.form.controls.username.errors.banned
  // }

  // validateUsernameUnique(formControl: FormControl): Observable<ValidationErrors> {
  //   let value = formControl.value
  //   if (!value) { return of({ empty:{value:value}}) }
  //   console.debug('validate username', value)
  //   return of(Math.random() > 0.7 ? null : { unique:{value:value} }).pipe(delay(2500))
  // }

  validatePasswordMatch(formGroup: FormGroup): ValidationErrors {
    let password1 = formGroup.controls['password1']
    let password2 = formGroup.controls['password2']
    if ( password2.errors && !password2.errors.match ) {
    } else if (password1.value !== password2.value) {
      password2.setErrors({ match: true })
    } else {
      password2.setErrors(null)
    }
    return null
  }

  submit() {
    if (!this.form.valid) { return }

    this.ws.send('/signup', {
      username:this.form.get('username').value,
      email:this.form.get('email').value,
      password1:this.form.get('password1').value,
      password2:this.form.get('password2').value
    })
  }
}
