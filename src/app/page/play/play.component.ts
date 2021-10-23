import { Component } from '@angular/core'
import { DataService } from 'src/app/data.service';
import { GameService } from 'src/app/game.service';

@Component({
  selector: 'vii-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.less']
})
export class PlayComponent {

  constructor(
    public data : DataService,
    public game : GameService,
  ) { }

}
