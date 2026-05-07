import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceAbsence } from './presence-absence';

describe('PresenceAbsence', () => {
  let component: PresenceAbsence;
  let fixture: ComponentFixture<PresenceAbsence>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresenceAbsence]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresenceAbsence);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
