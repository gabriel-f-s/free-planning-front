import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router, RouterLink} from '@angular/router';
import {AuthResponse, LoginRequest, RegisterRequest} from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ]
})
export class Login {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private authService: AuthService, private router: Router) {
  }

  doLogin() {
    if (this.loginForm.valid) {
      const data: LoginRequest = this.loginForm.value;
      this.authService.login(data).subscribe({
        next: (response: AuthResponse) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error(error);
        }
      })
    }
  }
}
