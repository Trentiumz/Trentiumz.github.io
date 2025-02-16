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

  // angles at which to position image icons!
  angle: { [key: string]: number } = {
    "icon-linkedin": 60,
    "icon-github": 0,
    "icon-codeforces": -60,
    "icon-dmoj": -120
  }

  ngAfterViewInit() {
    // icon repositioning!
    let imageContainerElement: Element = this.imageContainer.nativeElement;
    let icons: HTMLElement[] = Array.from(imageContainerElement.querySelectorAll('.social-image'));

    // function for putting icons in a circle
    const repositionIcons = () => {
      for(let icon of icons) {
        let xPos = imageContainerElement.clientWidth / 2 * (1 + Math.cos(this.angle[icon.id] * Math.PI / 180)) - icon.clientWidth / 2;
        let yPos = imageContainerElement.clientHeight / 2 * (1 + Math.sin(this.angle[icon.id] * Math.PI / 180)) - icon.clientHeight / 2;
        icon.style.left = `${xPos}px`;
        icon.style.top = `${yPos}px`;
      }
    }

    // server side rendering fallback; add event listener for when user resizes an object
    if (typeof ResizeObserver === 'undefined') {
      repositionIcons();
      imageContainerElement.addEventListener('resize', repositionIcons);
      for(let icon of icons) {
        icon.addEventListener('resize', repositionIcons);
      }
    } else {
      // ideal implementation - repositions upon any resizing
      const iconPositioner = new ResizeObserver(() => {
        repositionIcons();
      })
      iconPositioner.observe(imageContainerElement)
    }
  }
}

