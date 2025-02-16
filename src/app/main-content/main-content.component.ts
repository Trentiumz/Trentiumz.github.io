import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [AchievementCardComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  @ViewChild("imageContainer") imageContainer!: ElementRef;
  angle: { [key: string]: number } = {
    "icon-linkedin": 60,
    "icon-github": 0,
    "icon-codeforces": -60,
    "icon-dmoj": -120
  }

  ngAfterViewInit() {
    let imageContainerElement: Element = this.imageContainer.nativeElement;
    let icons: HTMLElement[] = Array.from(imageContainerElement.querySelectorAll('.social-image'));
    const repositionIcons = () => {
      for(let icon of icons) {
        let xPos = imageContainerElement.clientWidth / 2 * (1 + Math.cos(this.angle[icon.id] * Math.PI / 180)) - icon.clientWidth / 2;
        let yPos = imageContainerElement.clientHeight / 2 * (1 + Math.sin(this.angle[icon.id] * Math.PI / 180)) - icon.clientHeight / 2;
        icon.style.left = `${xPos}px`;
        icon.style.top = `${yPos}px`;
        console.log(`${icon.id}: ${xPos} ${yPos}`);
      }
    }
    const iconPositioner = new ResizeObserver(entries => {
      repositionIcons();
    })
    iconPositioner.observe(imageContainerElement)
    for(let icon of icons) {
      iconPositioner.observe(icon);
    }
  }
}

