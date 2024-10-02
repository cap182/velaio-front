import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./task/task/task.component')
  },
  {
    path: 'tasks/list',
    loadComponent: () => import('./task/views/task-list/task-list.component')
  },
  { path: '**', redirectTo: '/tasks/list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
