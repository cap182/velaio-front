  import { Component, OnInit, inject } from '@angular/core';
  import { TaskService } from '../../../services/task.service';
  import { Task } from '../../../models/models';
  import { CommonModule } from '@angular/common';
  import { ToastrService } from 'ngx-toastr';
  import { RouterModule } from '@angular/router';

  @Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [CommonModule,
      RouterModule 
    ],
    templateUrl: './task-list.component.html',
  })
  export default class TaskListComponent implements OnInit {

    private taskService = inject(TaskService)
    private toastr = inject(ToastrService)
    
    tasks: Task[] = [];
    filteredTasks: Task[] = [];
    errorMessage: string | null = null;


    ngOnInit(): void {
      this.loadTasks();
    }

    loadTasks(): void {
      this.taskService.getAllTasks().subscribe({
        next: (data: Task[]) => {
          this.tasks = data;
          this.filteredTasks = data;
          console.log('toaster', this.toastr);
          
          this.toastr.success('Tareas cargadas correctamente');
        },
        error: () => {        
          this.toastr.error('Error al cargar las tareas');
        },
      });
    }

    filterTasks(status: boolean | null): void {
      if (status === null) {
        this.filteredTasks = this.tasks;
      } else {
        this.filteredTasks = this.tasks.filter(task => task.isCompleted === status);
      }
    }
  }