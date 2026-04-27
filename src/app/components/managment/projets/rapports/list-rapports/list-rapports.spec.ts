import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRapports } from './list-rapports';

describe('ListRapports', () => {
  let component: ListRapports;
  let fixture: ComponentFixture<ListRapports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRapports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRapports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
