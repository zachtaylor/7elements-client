import { Component, HostListener } from '@angular/core'
import { CookieService } from './cookie.service'
import { StyleService } from './style.service';

@Component({
  selector: 'vii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = ''

  constructor(public cookies : CookieService, private style : StyleService) { }
  
  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width : number) { this.style.onResize(width) }
}
