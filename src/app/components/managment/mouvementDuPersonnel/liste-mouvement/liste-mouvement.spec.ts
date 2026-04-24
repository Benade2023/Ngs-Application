import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMouvement } from './liste-mouvement';

describe('ListeMouvement', () => {
  let component: ListeMouvement;
  let fixture: ComponentFixture<ListeMouvement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeMouvement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeMouvement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
