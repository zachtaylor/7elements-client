import { Component, Input } from '@angular/core'

@Component({
  selector: 'article-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.less']
})
export class ArticleBodyComponent {

  @Input()
  collapse = false

  constructor() { }

}
