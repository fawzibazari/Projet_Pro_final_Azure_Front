import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../Services/auth.service';

declare var particlesJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  nameState!: Boolean | null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
    this.nameState = null
    console.log(this.loginForm);
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      mail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login(): void {
    console.log(this.loginForm.value);
    this.authService
      .login(
        this.loginForm.value.mail,
        this.loginForm.value.password
      )
      .subscribe((response) => {
        if (response.success) {
          // connexion réussie, stocker le jeton d'authentification
          localStorage.setItem('token', response.token);
          console.log('login success');
          // rediriger vers la page de dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // afficher un message d'erreur
          alert(response.message);
        }
      });
  }

  onFocusPassword(): void {
    this.nameState = !this.nameState;
  }
}
