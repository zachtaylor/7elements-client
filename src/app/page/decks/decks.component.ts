import { Component } from '@angular/core';
import { AccountService } from 'src/app/account.service';
import { GlobalService } from 'src/app/global.service';
import { RuntimeService } from 'src/app/runtime.service';

@Component({
  selector: 'vii-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.less']
})
export class DecksComponent  {

  constructor(
    public glob: GlobalService,
    public account: AccountService,
    public runtime: RuntimeService
  ) { }

}
