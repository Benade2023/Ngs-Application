import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAgents } from './details-agents';

describe('DetailsAgents', () => {
  let component: DetailsAgents;
  let fixture: ComponentFixture<DetailsAgents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsAgents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsAgents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
