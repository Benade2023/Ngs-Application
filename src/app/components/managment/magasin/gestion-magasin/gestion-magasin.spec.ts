import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMagasin } from './gestion-magasin';

describe('GestionMagasin', () => {
  let component: GestionMagasin;
  let fixture: ComponentFixture<GestionMagasin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMagasin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMagasin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
