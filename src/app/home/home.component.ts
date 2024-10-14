import { Component } from '@angular/core';
import { TopbarComponent } from '.././topbar/topbar.component';
import { SidebarComponent } from '.././sidebar/sidebar.component';
import { MainContentComponent } from '.././main-content/main-content.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopbarComponent, SidebarComponent, MainContentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
