import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementCardComponent } from './achievement-card.component';

describe('AchievementCardComponent', () => {
  let component: AchievementCardComponent;
  let fixture: ComponentFixture<AchievementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
