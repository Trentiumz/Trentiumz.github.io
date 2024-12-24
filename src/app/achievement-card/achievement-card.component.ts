import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-achievement-card',
  standalone: true,
  imports: [],
  templateUrl: './achievement-card.component.html',
  styleUrl: './achievement-card.component.scss'
})
export class AchievementCardComponent {
  @Input({required: true}) title: string = "";
  @Input({required: false}) description: string = "";
  @Input({required: false}) imageUrl: string = "";
  @Input({required: false}) alignment: string = "left";
}
