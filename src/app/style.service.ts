import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  /**
   * Scale indicates the magnitude of the display size
   * 
   * 0 none
   * 
   * 1 mobile
   * 
   * 2 medium
   * 
   * 3 large
   */
  scale$ = new BehaviorSubject<number>(0)

  constructor() {
    this.scale$.subscribe(scale => this.onScale(scale))
    this.onResize(window.innerWidth)
  }

  isSmall() : boolean {
    return this.scale$.value == 1
  }
  isMedium() : boolean {
    return this.scale$.value == 2
  }
  isLarge() : boolean {
    return this.scale$.value == 3
  }

  onResize(width : number) {
    if (width < 600) {
      this.setScale(1)
    } else if (width < 900) {
      this.setScale(2)
    } else {
      this.setScale(3)
    }
  }

  setScale(scale : number) {
    if (this.scale$.value != scale) {
      console.debug('layout scale:', scale)
      this.scale$.next(scale)
    }
  }

  onScale(scale : number) {
    if (scale <= 1) {
      this.setProperties(32, 8, 14, 20, 14, 10)
    } else if (scale <= 2) {
      this.setProperties(42, 12, 16, 24, 18, 11)
    } else {
      this.setProperties(48, 16, 18, 27, 21, 14)
    }
  }

  setProperties(ui: number, padding: number, font0: number, font1: number, font2: number, font3: number) {
    document.body.style.setProperty('--ui', ui+'px')
    document.body.style.setProperty('--pad', padding+'px')
    document.body.style.setProperty('--font0', font0+'px')
    document.body.style.setProperty('--font1', font1+'px')
    document.body.style.setProperty('--font2', font2+'px')
    document.body.style.setProperty('--font3', font3+'px')
    document.body.style.setProperty('font-size', 'var(--font0)')
  }
}
