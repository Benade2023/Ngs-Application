import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgents } from './add-agents';

describe('AddAgents', () => {
  let component: AddAgents;
  let fixture: ComponentFixture<AddAgents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAgents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAgents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
