import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-404',
  standalone: true,
  imports: [],
  templateUrl: './404.component.html',
  styleUrl: './404.component.scss'
})
export class Component404 {
  glitchPosition: string = "0 0";
  intervalId: any;
  platformId: Object;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      this.runAnimation();
    }
  }

  runAnimation() {
    let curframe = 0;
    const totalFrames = 40;
    let cx = 0, cy = 0;
    this.intervalId = setInterval(() => {
      if(curframe == 0) cx = Math.random() * 400 - 200, cy = -Math.random() * 500;
      if(curframe >= 36) {
        cx = Math.random() * 400 - 200; 
        cy = -Math.random() * 500;
      }
      this.glitchPosition = `${cx}px ${cy}px`;
      curframe = (curframe + 1) % totalFrames;
    }, 50);
  }
  
  ngOnDestroy() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
