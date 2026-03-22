import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Link2, LogOut, LucideAngularModule } from 'lucide-angular';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './header.html',
})
export class Header {
  readonly Link2 = Link2;
  readonly LogOut = LogOut;

  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) {}

  logout() {
    this.cookieService.delete('session', '/');
    this.router.navigate(['/']);
  }
}
