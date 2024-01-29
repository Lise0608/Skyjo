import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ListGameComponent } from './components/admin/list-game/list-game.component';
import { PlateauGraphiqueComponent } from './components/plateau/plateau-graphique/plateau-graphique.component';
import { ListUserComponent } from './components/admin/list-user/list-user.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { AuthentificationInterceptor } from './interceptors/authentification.interceptors';
import { CreationDePartieComponent } from './components/creation-de-partie/creation-de-partie.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    MenuComponent,
    HomeComponent,
    ForgotPasswordComponent,
    ListGameComponent,
    PlateauGraphiqueComponent,
    ListUserComponent,
    AdminPanelComponent,
    CreationDePartieComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthentificationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
