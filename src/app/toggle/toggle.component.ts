import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.less']
})
export class ToggleComponent implements AfterViewInit {

  @ViewChild('input')
  private input : ElementRef

  // _check is store for awaiting ViewChild
  private _check: boolean

  get check() : boolean {
    if (this.input) return this.input.nativeElement.checked
    return this._check
  }
  @Input() set check(check : boolean) {
    if (this.input) this.input.nativeElement.checked = check
    else this._check = check
  }

  @Output() checkChange = new EventEmitter<boolean>()

  constructor() { }

  ngAfterViewInit() {
    if (this._check) this.check = true
  }

  toggle($event) {
    if ($event) $event.stopPropagation()
    this.check = !this.check
    this.checkChange.emit(this.check)
  }

}
