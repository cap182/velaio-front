import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service'; // Servicio de tareas
import { Task } from '../../models/models'; // Modelo de la tarea

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export default class TaskComponent {
  taskForm: FormGroup;
  newSkill = new FormControl('');
  submitted = false;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      limitDate: ['', [Validators.required, this.minDateValidator]],
      isCompleted: [false],
      users: this.fb.array([], [this.atLeastOneValidator, this.noDuplicateUsers]), // Debe haber al menos un usuario
    });
  }

  // Obtener el FormArray de usuarios
  get users(): FormArray {
    return this.taskForm.get('users') as FormArray;
  }

  // Validación personalizada para evitar duplicados en nombres de usuario
  noDuplicateUsers(control: AbstractControl) {
    const formArray = control as FormArray;
    const userNames = formArray.controls.map((userGroup: AbstractControl) => userGroup.get('userName')?.value.replaceAll(' ','').toLowerCase());
    const duplicates = userNames.filter((name, index, array) => array.indexOf(name) !== index);

    return duplicates.length > 0 ? { duplicateUsers: true } : null;
  }
  atLeastOneValidator(control: AbstractControl) {
    const formArray = control as FormArray;
    return formArray.length > 0 ? null : { atLeastOne: true };
  }
  minDateValidator(control: FormControl) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      return { minDate: true };
    }
    return null;
  }

  // Crear un nuevo FormGroup para el usuario
  createUserGroup(): FormGroup {
    return this.fb.group({
      userName: ['', Validators.required],
      userAge: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array([], this.atLeastOneValidator),
    });
  }

  // Añadir un nuevo usuario al FormArray
  addUser(): void {
    this.users.push(this.createUserGroup());
  }

  // Remover un usuario del FormArray
  removeUser(index: number): void {
    this.users.removeAt(index);
  }

  getSkills(userIndex: number): FormArray {
    return this.users.at(userIndex).get('skills') as FormArray;
  }

  addSkill(userIndex: number): void {
    if (this.newSkill.value && this.newSkill.value.trim()) {
      this.getSkills(userIndex).push(new FormControl(this.newSkill.value));
      this.newSkill.reset(); // Limpiar el input después de agregar la habilidad
    }
  }

  removeSkill(userIndex: number, skillIndex: number): void {
    this.getSkills(userIndex).removeAt(skillIndex);
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    this.submitted = true;
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      // Crear el objeto Task
      const newTask: Task = {
        title: formValue.title,
        limitDate: new Date(formValue.limitDate).getTime(), // Convertir la fecha a timestamp
        isCompleted: formValue.isCompleted,
        users: formValue.users.map((user: any) => ({
          userName: user.userName,
          userAge: user.userAge,
          skills: user.skills,
        })),
      };
      console.log('TASK!!', newTask);

      // Llamada al servicio para crear la tarea
      this.taskService.createTask(newTask).subscribe({
        next: (task) => {
          console.log('Tarea creada:', task);
        },
        error: (err) => {
          console.error('Error al crear la tarea:', err);
        },
      });
    }
  }
}
