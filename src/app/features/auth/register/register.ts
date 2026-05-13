import {Component, model} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {AuthResponse, RegisterRequest} from '../../../core/models/auth.model';
import {Occupation} from '../../../core/enums/occupation.enum';
import {ButtonDirective} from 'primeng/button';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputNumber,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    occupation: new FormControl('', [Validators.required]),
    hourlyRate: new FormControl('', [Validators.required]),
  })

  constructor(private authService: AuthService, private router: Router) {
  }

  doRegister() {
    if (this.registerForm.valid) {
      const data: RegisterRequest = this.registerForm.value;
      this.authService.register(data).subscribe({
        next: (response: AuthResponse) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error(error);
        }
      })
    }
  }

  protected readonly Occupation = Occupation;
}
