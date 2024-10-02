import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service'; // Servicio para cargar tareas
import { Task } from '../../../models/models'; // Interfaz de Task
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export default class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = []; // Tareas filtradas
  errorMessage: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // Cargar todas las tareas
  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.filteredTasks = data; // Mostrar todas las tareas por defecto
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las tareas';
        console.error('Error al obtener las tareas:', error);
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