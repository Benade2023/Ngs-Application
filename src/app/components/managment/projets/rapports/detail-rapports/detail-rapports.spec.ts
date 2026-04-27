import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRapports } from './detail-rapports';

describe('DetailRapports', () => {
  let component: DetailRapports;
  let fixture: ComponentFixture<DetailRapports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailRapports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailRapports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
