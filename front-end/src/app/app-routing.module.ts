import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Import all the components for which navigation service is needed
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/auth/login/login.component';
import { SignUpComponent } from './Components/auth/sign-up/sign-up.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { ImagesListComponent } from './Components/images-list/images-list.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { ImageInfoComponent } from './Components/image-info/image-info.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'images-list', component: ImagesListComponent },
  { path: 'image-info/:imageId', component: ImageInfoComponent },
  { path: '**', pathMatch: 'full', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
