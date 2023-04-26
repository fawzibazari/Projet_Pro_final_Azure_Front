import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signupForm!: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.createFormGroup();
    console.log(this.signupForm);
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  signup(): void {
    console.log(this.signupForm.value);
    this.authService.signup(
      this.signupForm.value.firstname,
      this.signupForm.value.mail,
      this.signupForm.value.password).subscribe(
        response => {
          if (response.success) {
            // inscription réussie, stocker le jeton d'authentification
            localStorage.setItem('token', response.token);
            console.log("signup success");
            // rediriger vers la page de dashboard
            this.router.navigate(['/dashboard']);
          } else {
            // afficher un message d'erreur
            alert(response.message);
          }
        }
      );
  }

}
