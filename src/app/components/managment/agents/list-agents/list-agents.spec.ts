import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAgents } from './list-agents';

describe('ListAgents', () => {
  let component: ListAgents;
  let fixture: ComponentFixture<ListAgents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAgents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAgents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
