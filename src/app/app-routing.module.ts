import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"
import { AccountComponent } from "./page/account/account.component"
import { BuyComponent } from "./page/buy/buy.component"
import { CardsComponent } from "./page/cards/cards.component"
import { DecksComponent } from "./page/decks/decks.component"
import { DeckEditComponent } from "./page/decks/edit/edit.component"
import { DeckViewComponent } from "./page/decks/view/view.component"
import { DeveloperComponent } from "./page/developer/developer.component"
import { ArtistComponent } from "./page/developer/artist/artist.component"
import { NextComponent } from "./page/developer/next/next.component"
import { SinkComponent } from "./page/developer/sink/sink.component"
import { IndexComponent } from "./page/index/index.component"
import { IntroComponent } from "./page/intro/intro.component"
import { NotFoundComponent } from "./page/notfound/notfound.component"
import { UpdatesComponent } from "./page/updates/updates.component"
import { PlayComponent } from "./page/play/play.component"
import { LostComponent } from "./page/lost/lost.component"
import { AdminGuard } from "./admin.guard"

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'lost', component: LostComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'updates', component: UpdatesComponent },
  { path: 'account', component: AccountComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'buy', component: BuyComponent },
  { path: 'decks', component: DecksComponent },
  { path: 'decks/edit/:id', component: DeckEditComponent },
  { path: 'decks/view/:id', component: DeckViewComponent },
  { path: 'admin', canLoad: [AdminGuard],
    loadChildren: () => import('./page/admin/admin.module').then(m => m.AdminModule)
  },
  { path: 'play', component: PlayComponent },
  { path: 'dev', component: DeveloperComponent },
  { path: 'dev/art', component: ArtistComponent },
  { path: 'dev/next', component: NextComponent },
  { path: 'dev/sink', component: SinkComponent },
  { path: '**', redirectTo:'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
