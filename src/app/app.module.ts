import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { CountPipe, EscapeHtmlPipe, MapCountPipe, MapKeysPipe, MapValuesPipe } from './app.pipes'
import { AppComponent } from './app.component'
import { NavComponent } from './nav/nav.component'
import { ToggleComponent } from './toggle/toggle.component'
import { ArticleComponent } from './article/article.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouteComponent } from './route/route.component'
import { CardComponent } from './card/card.component'
import { DeckboxComponent } from './deckbox/deckbox.component'
import { CarouselComponent } from './carousel/carousel.component'
import { FormDetailComponent } from './form-detail/form-detail.component'
import { ArticleHeaderComponent } from './article/header/header.component'
import { ArticleBodyComponent } from './article/body/body.component'
import { ArticleFooterComponent } from './article/footer/footer.component'

// pages
import { AccountComponent } from './page/account/account.component'
import { LoginComponent } from './page/account/login/login.component'
import { SignupComponent } from './page/account/signup/signup.component'
import { BuyComponent } from './page/buy/buy.component'
import { CardsComponent } from './page/cards/cards.component'
import { DecksComponent } from './page/decks/decks.component'
import { DeckEditComponent } from './page/decks/edit/edit.component'
import { DeckViewComponent } from './page/decks/view/view.component'
import { IndexComponent } from './page/index/index.component'
import { IntroComponent } from './page/intro/intro.component'
import { NotFoundComponent } from './page/notfound/notfound.component'
import { UpdatesComponent } from './page/updates/updates.component'
import { DeveloperComponent } from './page/developer/developer.component'
import { ArtistComponent } from './page/developer/artist/artist.component'
import { NextComponent } from './page/developer/next/next.component'
import { SinkComponent } from './page/developer/sink/sink.component'
import { PlayComponent } from './page/play/play.component'
import { TickerComponent } from './ticker/ticker.component'
import { LostComponent } from './page/lost/lost.component'

@NgModule({
  declarations: [
    AppComponent,
    // pipes
    CountPipe,
    EscapeHtmlPipe,
    MapKeysPipe,
    MapValuesPipe,
    MapCountPipe,
    // components
    NavComponent,
    ToggleComponent,
    FormDetailComponent,
    CardComponent,
    DeckboxComponent,
    CarouselComponent,
    ArticleComponent,
    ArticleHeaderComponent,
    ArticleBodyComponent,
    ArticleFooterComponent,
    RouteComponent,
    // pages
    IndexComponent,
    NotFoundComponent,
    IntroComponent,
    UpdatesComponent,
    AccountComponent,
    LoginComponent,
    SignupComponent,
    BuyComponent,
    CardsComponent,
    DecksComponent,
    DeckEditComponent,
    DeckViewComponent,
    PlayComponent,
    DeveloperComponent,
    ArtistComponent,
    NextComponent,
    SinkComponent,
    TickerComponent,
    LostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
