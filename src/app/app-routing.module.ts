import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent } from './login';
import { DashboardComponent } from './dashboard'

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
