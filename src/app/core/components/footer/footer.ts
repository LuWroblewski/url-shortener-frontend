import { Component } from '@angular/core';
import { Link, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [LucideAngularModule],
  templateUrl: './footer.html',
})
export class Footer {
  readonly Link = Link;
  readonly currentYear = new Date().getFullYear();
}
