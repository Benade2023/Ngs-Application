import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMouvement } from './detail-mouvement';

describe('DetailMouvement', () => {
  let component: DetailMouvement;
  let fixture: ComponentFixture<DetailMouvement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailMouvement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailMouvement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
