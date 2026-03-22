import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { CircleX, Copy, Link2Off, LucideAngularModule, RotateCcw, Trash2 } from 'lucide-angular';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { notyf } from '../../../shared/notfy/notyf.service';

export interface UrlEntry {
  id: number;
  public_id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  status: number;
  createdAt: string;
}

@Component({
  selector: 'app-url-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './url-table.html',
})
export class UrlTable implements OnInit {
  readonly Link2Off = Link2Off;
  readonly CircleX = CircleX;
  readonly Copy = Copy;
  readonly Trash2 = Trash2;
  readonly RotateCcw = RotateCcw;
  urls = signal<UrlEntry[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private cookieService: CookieService) {}

  async ngOnInit() {
    await this.fetchUrls();
  }

  async fetchUrls() {
    this.loading.set(true);
    this.error.set(null);

    const token = this.cookieService.get('session');

    try {
      const response = await fetch(`${environment.apiUrl}urls`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.urls.set(data?.data ?? data);
    } catch (err: any) {
      this.error.set(err.message ?? 'Erro ao carregar URLs.');
      notyf.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }

  getShortUrl(shortCode: string): string {
    return `${environment.apiUrl}urls/shortCode/${shortCode}`;
  }

  async copyToClipboard(text: string) {
    await navigator.clipboard.writeText(this.getShortUrl(text));
    notyf.success('Link copiado!');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  async deleteUrl(publicId: string) {
    const token = this.cookieService.get('session');
    try {
      const response = await fetch(`${environment.apiUrl}urls/${publicId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message ?? 'Erro ao excluir URL');
      }
      notyf.success('URL excluída com sucesso!');
      await this.fetchUrls();
    } catch (err: any) {
      notyf.error(err.message ?? 'Falha ao excluir URL.');
    }
  }

  async reactivateUrl(publicId: string) {
    const token = this.cookieService.get('session');
    try {
      const response = await fetch(`${environment.apiUrl}urls/${publicId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 1 }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message ?? 'Erro ao reativar URL');
      }
      notyf.success('URL reativada com sucesso!');
      await this.fetchUrls();
    } catch (err: any) {
      notyf.error(err.message ?? 'Falha ao reativar URL.');
    }
  }
}
