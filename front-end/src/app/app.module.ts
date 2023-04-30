import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RiveModule } from 'ng-rive';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { SignUpComponent } from './Components/auth/sign-up/sign-up.component';
import { LoginComponent } from './Components/auth/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { ImagesListComponent } from './Components/images-list/images-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SignUpComponent,
    LoginComponent,
    DashboardComponent,
    ImagesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,

    RiveModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
