import { Routes } from '@angular/router';
import { LoginComponent } from './containers/login/login.component';
import { HomeComponent } from './containers/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];
