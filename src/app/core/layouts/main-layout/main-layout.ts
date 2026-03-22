import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { notyf } from '../../../shared/notfy/notyf.service';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
})
export class MainLayout implements OnInit {
  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const token = this.cookieService.get('session');

    if (!token) {
      notyf.error('Sessão expirada. Faça login novamente.');
      this.router.navigate(['/']);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.data?.valid) {
        throw new Error('Token inválido');
      }

      notyf.success('Acesso autorizado.');
    } catch (err) {
      notyf.error('Sessão inválida. Faça login novamente.');
      this.cookieService.delete('session');
      this.router.navigate(['/login']);
    }
  }
}
