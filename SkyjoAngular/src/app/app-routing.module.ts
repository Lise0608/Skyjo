import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PlateauGraphiqueComponent } from './components/plateau/plateau-graphique/plateau-graphique.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: LoginComponent },
  { path: 'inscription', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'plateau', component: PlateauGraphiqueComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
