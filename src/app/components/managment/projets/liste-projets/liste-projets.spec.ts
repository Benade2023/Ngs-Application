import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeProjets } from './liste-projets';

describe('ListeProjets', () => {
  let component: ListeProjets;
  let fixture: ComponentFixture<ListeProjets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeProjets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeProjets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
