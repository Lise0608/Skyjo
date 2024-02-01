import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PlateauGraphiqueComponent } from './components/plateau/plateau-graphique/plateau-graphique.component';
import { CreationDePartieComponent } from './components/creation-de-partie/creation-de-partie.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { LoggedGuardService } from './services/logged-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { PartieTermineeComponent } from './components/partie-terminee/partie-terminee.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [LoggedGuardService] },
  { path: 'auth', component: LoginComponent },
  { path: 'inscription', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'partie-terminee', component: PartieTermineeComponent },
  {
    path: 'creation-de-partie',
    component: CreationDePartieComponent,
    canActivate: [LoggedGuardService],
  },
  {
    path: 'plateau/:donneesJoueurs',
    component: PlateauGraphiqueComponent,
    canActivate: [LoggedGuardService],
  },
  {
    path: 'plateau',
    component: PlateauGraphiqueComponent,
    canActivate: [LoggedGuardService],
  },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AdminGuardService],
  },
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
