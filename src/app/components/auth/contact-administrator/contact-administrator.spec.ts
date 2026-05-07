import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAdministrator } from './contact-administrator';

describe('ContactAdministrator', () => {
  let component: ContactAdministrator;
  let fixture: ComponentFixture<ContactAdministrator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactAdministrator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactAdministrator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
