import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMouvement } from './add-mouvement';

describe('AddMouvement', () => {
  let component: AddMouvement;
  let fixture: ComponentFixture<AddMouvement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMouvement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMouvement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
