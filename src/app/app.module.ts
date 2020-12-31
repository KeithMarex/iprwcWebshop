import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { NewsComponent } from './landing/news/news.component';
import { KlantenpaneelComponent } from './klantenpaneel/klantenpaneel.component';
import { LoginComponent } from './klantenpaneel/login/login.component';
import { PasswordForgetComponent } from './klantenpaneel/password-forget/password-forget.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingCartListComponent } from './shopping-cart/shopping-cart-list/shopping-cart-list.component';
import {HttpClientModule} from '@angular/common/http';
import { RegisterComponent } from './klantenpaneel/register/register.component';
import {ConfigurationService} from "./shared/configuration.service";
import {CookieService} from "ngx-cookie-service";
import { WinkelwagenComponent } from './landing/winkelwagen/winkelwagen.component';
import { AccountComponent } from './landing/account/account.component';

const appRoutes: Routes = [
  {path: 'klantenpaneel', component: KlantenpaneelComponent},
  {path: '', component: LandingComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    NewsComponent,
    KlantenpaneelComponent,
    LoginComponent,
    PasswordForgetComponent,
    ShoppingCartComponent,
    ShoppingCartListComponent,
    RegisterComponent,
    WinkelwagenComponent,
    AccountComponent
    // ProductsComponent,
    // ProductComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
  ],
  providers: [ConfigurationService, CookieService, HeaderComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
