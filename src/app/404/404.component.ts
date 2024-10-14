import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-404',
  standalone: true,
  imports: [],
  templateUrl: './404.component.html',
  styleUrl: './404.component.scss'
})
export class Component404 {
  glitchPosition: string = "0 0";
  blobleft: string = "0";
  blobtop: string = "0";
  intervalId: any;
  mainPageDisplay: string = "none"

  platformId: Object;

  introDisplay: string = "flex";

  typeTransition: string = "none";
  mainTransition: string = "none";

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      this.typeWriterAnimation(this.runMainAnimation)
    }
  }

  typeWriterAnimation(next: () => void) {
    const typeStrings = (toType: {id: string, value: string}[], whenDone: () => void) => {
      let cur: () => void = whenDone;
      for(const i of toType.reverse()) {
        let curFunc = cur;
        cur = () => {
          new Typewriter(`#${i.id}`, { loop: false, delay: 50}).typeString(i.value).pauseFor(400)
            .callFunction(curFunc).start();
        }
      }
      cur();
    }
    setTimeout(() => {
      typeStrings([
        {id: "first", value: "Where's the site?"},
        {id: "second", value: "Here?"},
        {id: "third", value: "What about here?"},
        {id: "fourth", value: "Or here?"},
        {id: "fifth", value: "Where's the site??????"}
      ], () => {
        setTimeout(() => {
          let percent = 0
          const intervalId = setInterval(() => {
            if(percent > 100) {
              console.log('done')
              this.introDisplay = "none";
              this.mainTransition = "none";
              this.typeTransition = "none";
              this.runMainAnimation();
              clearInterval(intervalId)
            } else {
              this.mainTransition = `radial-gradient(circle at center, black ${percent}%, transparent ${percent + 1}%)`
              this.typeTransition = `radial-gradient(circle at center, transparent ${percent}%, black ${percent + 1}%)`
              this.mainPageDisplay = "flex";
              percent += 7;
            }
          }, 20);
        }, 1000)
      });
    }, 1000)
  }

  runMainAnimation() {
    let curframe = 0;
    const totalFrames = 40;
    let cx = 0, cy = 0;
    let blobX=0, blobY=0;
    this.intervalId = setInterval(() => {
      if(curframe == 0) {
        cx = Math.random() * 400 - 200, cy = -Math.random() * 500;
        blobX = blobY = 0;
      }
      if(curframe >= 36) {
        cx = Math.random() * 400 - 200; 
        cy = -Math.random() * 500;
        blobX = Math.random() * 400 - 200;
        blobY = Math.random() * 400 - 200;
      }
      this.glitchPosition = `${cx}px ${cy}px`;
      this.blobleft = `${blobX}px`;
      this.blobtop = `${blobY}px`;
      curframe = (curframe + 1) % totalFrames;
    }, 50);
  }
  
  ngOnDestroy() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
