import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { notyf } from '../../../shared/notfy/notyf.service';

@Component({
  selector: 'app-login-layout',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-layout.html',
})
export class LoginLayout {
  private router = inject(Router);
  constructor(private cookieService: CookieService) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  async onSubmit() {
    if (!this.loginForm.valid) {
      notyf.error('Username e senha são obrigatórios.');
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    try {
      const response = await fetch(`${environment.apiUrl}auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, password: password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      this.cookieService.set('session', data.data.access_token, {
        expires: 0.5,
        sameSite: 'Strict',
        secure: true,
      });

      notyf.success('Login bem-sucedido!');
      this.router.navigate(['/menu/dashboard']);
    } catch (error) {
      console.error('Erro no login:', error);
      notyf.error('Falha ao realizar login.');
    }
  }
}
