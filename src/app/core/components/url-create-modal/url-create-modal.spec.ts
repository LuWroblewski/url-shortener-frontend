import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlCreateModal } from './url-create-modal';

describe('UrlCreateModal', () => {
  let component: UrlCreateModal;
  let fixture: ComponentFixture<UrlCreateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlCreateModal],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlCreateModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
