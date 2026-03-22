import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Link2, LucideAngularModule, Plus, X } from 'lucide-angular';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { notyf } from '../../../shared/notfy/notyf.service';

@Component({
  selector: 'app-url-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './url-create-modal.html',
})
export class CreateUrlModal {
  @Output() urlCreated = new EventEmitter<void>();

  readonly Plus = Plus;
  readonly X = X;
  readonly Link2 = Link2;

  isOpen = signal(false);
  loading = signal(false);

  form = new FormGroup({
    originalUrl: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/^\s*https?:\/\/.+/)],
      nonNullable: true,
    }),
  });

  get originalUrl() {
    return this.form.get('originalUrl');
  }

  constructor(private cookieService: CookieService) {}

  open() {
    this.form.reset();
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  async onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const token = this.cookieService.get('session');

    try {
      const response = await fetch(`${environment.apiUrl}urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl: this.originalUrl?.value.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message ?? 'Erro ao cadastrar URL');
      }

      notyf.success('URL cadastrada com sucesso!');
      this.urlCreated.emit();
      this.close();
    } catch (err: any) {
      notyf.error(err.message ?? 'Falha ao cadastrar URL.');
    } finally {
      this.loading.set(false);
    }
  }
}
