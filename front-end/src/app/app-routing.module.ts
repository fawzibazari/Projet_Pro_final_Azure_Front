import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Import all the components for which navigation service is needed
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/auth/login/login.component';
import { SignUpComponent } from './Components/auth/sign-up/sign-up.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
