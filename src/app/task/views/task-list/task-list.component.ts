import { Component, OnInit, inject } from '@angular/core';
import { TaskService } from '../../../services/task.service'; // Servicio para cargar tareas
import { Task } from '../../../models/models'; // Interfaz de Task
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export default class TaskListComponent implements OnInit {

  private taskService = inject(TaskService)
  private toastr = inject(ToastrService)
  
  tasks: Task[] = [];
  filteredTasks: Task[] = []; // Tareas filtradas
  errorMessage: string | null = null;


  ngOnInit(): void {
    this.loadTasks();
  }

  // Cargar todas las tareas
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

  // Filtrar tareas por estado completado
  filterTasks(status: boolean | null): void {
    if (status === null) {
      this.filteredTasks = this.tasks; // Mostrar todas las tareas
    } else {
      this.filteredTasks = this.tasks.filter(task => task.isCompleted === status);
    }
  }
}