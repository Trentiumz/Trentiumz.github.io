import { Component } from '@angular/core';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [AchievementCardComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
