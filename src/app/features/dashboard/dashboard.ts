import { Component, ViewChild } from '@angular/core';
import { CreateUrlModal } from '../../core/components/url-create-modal/url-create-modal';
import { UrlTable } from '../../core/components/url-table/url-table';

@Component({
  selector: 'app-dashboard',
  imports: [UrlTable, CreateUrlModal],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  @ViewChild(UrlTable) urlTable!: UrlTable;

  onUrlCreated() {
    this.urlTable.fetchUrls();
  }
}
