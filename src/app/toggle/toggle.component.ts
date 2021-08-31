import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.less']
})
export class ToggleComponent {
  @Input() check = false
  @Output() checkChange = new EventEmitter<boolean>()

  constructor() { }

  toggle(event) {
    event.stopPropagation()
    this.check = !this.check
    this.checkChange.emit(this.check)
  }

}
