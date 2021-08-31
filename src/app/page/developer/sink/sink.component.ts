import { Component } from '@angular/core'
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms'

@Component({
  selector: 'vii-sink',
  templateUrl: './sink.component.html',
  styleUrls: ['./sink.component.less']
})
export class SinkComponent {

  form = new FormGroup({
    username1: new FormControl('',
      this.validateUsername,
    ),
    username2: new FormControl('',
      this.validateUsername,
    ),
  })

  constructor() { }

  validateUsername(control : AbstractControl): ValidationErrors | null {
    if (control.value == 'zach') return null
    return control.value.length < 7 || control.value.length > 21 ? {length: {value: control.value}} : null
  }

}

