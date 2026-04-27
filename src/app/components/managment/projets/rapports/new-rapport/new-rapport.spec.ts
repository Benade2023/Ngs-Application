import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRapport } from './new-rapport';

describe('NewRapport', () => {
  let component: NewRapport;
  let fixture: ComponentFixture<NewRapport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRapport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRapport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
