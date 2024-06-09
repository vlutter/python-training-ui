import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { TuiInputModule, TuiInputPasswordModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'login',
  standalone: true,
  imports: [TuiIslandModule, TuiInputModule, TuiInputPasswordModule, TuiButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public errorMessage?: string;
  public valid = false;
  public isRegister = false;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe({
      next: () => {
        this.errorMessage = undefined;
        this.valid = this.loginForm.valid;
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
        this.valid = this.registerForm.valid;
      }
    })
  }

  onLoginSubmit() {    
    if (!this.loginForm.valid) return;
  
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: () => {
        console.info('Navigate to ', ``)
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
