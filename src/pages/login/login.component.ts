import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public errorMessage?: string;
  public isRegister = false;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe({
      next: () => {
        this.errorMessage = undefined;
      }
    })

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    this.registerForm.valueChanges.subscribe({
      next: () => {
        this.errorMessage = undefined;
      }
    })
  }

  onLoginSubmit() {    
    if (!this.loginForm.valid) return;
  
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (response) => {
        this.errorMessage = response.error.error
      }
    });
  }

  onRegisterSubmit() {    
    if (!this.registerForm.valid) return;
  
    const email = this.registerForm.value.email;
    const name = this.registerForm.value.name;
    const password = this.registerForm.value.password;

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.isRegister = false;
      },
      error: (response) => {
        this.errorMessage = response.error.error
      }
    });
  }

  register() {
    this.isRegister = true;

    this.errorMessage = undefined;
  }

  login() {
    this.isRegister = false;

    this.errorMessage = undefined;
  }
}
