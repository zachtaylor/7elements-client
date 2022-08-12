import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms'
import { Subscription } from 'rxjs'
import { CookieService } from 'src/app/cookie.service'
import { ValidatorService } from 'src/app/validator.service'
import { WebsocketService } from 'src/app/websocket.service'

@Component({
  selector: 'vii-signup',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(7)
    ], this.validator.UsernameUnique()),
    email: new FormControl(''),
    password1: new FormControl(''),
    password2: new FormControl('',),
  }, this.validatePasswordMatch)

  errUsername: String

  private $formStatus: Subscription
  private pendingValidation: boolean

  constructor(
    private validator: ValidatorService,
    private cd: ChangeDetectorRef,
    private cookies: CookieService,
    private ws: WebsocketService
  ) {}

  ngOnInit() {
    this.$formStatus = this.form.statusChanges.subscribe(status => {
      if (status === 'PENDING') {
        console.log('pending validation')
        this.pendingValidation = true
      } else if (this.pendingValidation) {
        console.log('validation complete', this.form)
        this.pendingValidation = false
        this.cd.markForCheck()
      }
    })
    console.log(this.form)
  }

  ngOnDestroy() {
    this.$formStatus.unsubscribe()
  }

  // get f() { return this.form.controls }

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
    if (!this.cookies.allow) { return alert('please accept cookies') }

    this.ws.send('/signup', {
      username:this.form.get('username').value,
      email:this.form.get('email').value,
      password1:this.form.get('password1').value,
      password2:this.form.get('password2').value
    })
  }
}
