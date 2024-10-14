import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Component404 } from './404/404.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "**", component: Component404}
];
