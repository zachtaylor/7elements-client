import { AfterViewInit, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core'

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.less']
})
export class ArticleComponent implements AfterViewInit {

  @Input()
  collapse = false

  @HostBinding('class.collapse')
  private get isCollapsed() { return this.collapse }

  @ViewChild('body', {read: ElementRef})
  private body : ElementRef

  // animating limits animate calls
  private animating = false

  constructor() { }

  ngAfterViewInit(): void {
    if (this.collapse) { // begin collapse fix
      this.body.nativeElement.style.height = '0px'
    }
  }

  clickHeader() {
    if (this.animating) { return console.debug('prevent animation glitch') }
    this.animating = true

    if (this.collapse) {
      this.animateOpen()
    } else {
      this.animateClose()
    }
    this.collapse = !this.collapse
  }

  private animateOpen() {
    let me = this
    let el = this.body.nativeElement
    let elHeight = el.scrollHeight

    el.style.height = elHeight + 'px'

    el.addEventListener('transitionend', function listener(event) {
      el.removeEventListener('transitionend', listener)
      el.style.height = null
      me.animating = false
    });
  }
  private animateClose() {
    let me = this
    let el = this.body.nativeElement
    let elHeight = el.scrollHeight
    let elTransition = el.style.transition

    el.style.transition = '';

    requestAnimationFrame(function() {
      el.style.height = elHeight + 'px'
      el.style.transition = elTransition

      requestAnimationFrame(function() {
        el.style.height = 0 + 'px'
        me.animating = false
      });
    });
  }
}
