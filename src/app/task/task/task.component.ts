import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/models';
import { InputErrorComponent } from '../../shared/components/input-error/input-error.component';
import { CustomValidators } from 'src/app/utils/validators';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputErrorComponent,
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export default class TaskComponent implements OnInit {
  private taskService = inject(TaskService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskForm: FormGroup;
  newSkill = new FormControl('');
  submitted = false;
  isEditing = false;
  taskId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      taskId: [''],
      title: ['', Validators.required],
      limitDate: ['', [Validators.required, CustomValidators.minDateValidator]],
      isCompleted: [false],
      users: this.fb.array(
        [],
        [
          CustomValidators.atLeastOneValidator,
          CustomValidators.noDuplicateUsers,
        ]
      ),
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditing = true;
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: string): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        this.taskForm.patchValue({
          taskId: task.taskId,
          title: task.title,
          limitDate: new Date(task.limitDate).toISOString().substring(0, 10),
          isCompleted: task.isCompleted,
        });
        task.users.forEach((user) => {
          this.addUser(user.userName, user.userAge, user.skills);
        });
      },
      error: (err) => {
        this.toastr.error('Error al cargar la tarea');
      },
    });
  }

  get users(): FormArray {
    return this.taskForm.get('users') as FormArray;
  }

  addUser(userName = '', userAge: number = 0, skills: string[] = []): void {
    const userForm = this.fb.group({
      userName: [userName, [Validators.required, Validators.minLength(5)]],
      userAge: [userAge, [Validators.required, Validators.min(18)]],
      skills: this.fb.array(skills, CustomValidators.atLeastOneValidator),
    });
    this.users.push(userForm);
  }

  removeUser(index: number): void {
    this.users.removeAt(index);
  }

  getSkills(userIndex: number): FormArray {
    return this.users.at(userIndex).get('skills') as FormArray;
  }

  addSkill(userIndex: number): void {
    if (this.newSkill.value && this.newSkill.value.trim()) {
      this.getSkills(userIndex).push(new FormControl(this.newSkill.value));
      this.newSkill.reset();
    }
  }

  removeSkill(userIndex: number, skillIndex: number): void {
    this.getSkills(userIndex).removeAt(skillIndex);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      taskData.limitDate = new Date(taskData.limitDate).getTime();
      if (this.isEditing) {
        this.taskService.updateTask(taskData).subscribe({
          next: () => {
            this.toastr.success('Tarea actualizada correctamente');
            this.router.navigate(['/tasks/list']);
          },
          error: () => {
            this.toastr.error('Error al actualizar la tarea');
          },
        });
      } else {
        this.taskService.createTask(taskData).subscribe({
          next: () => {
            this.toastr.success('Tarea creada correctamente');
            this.router.navigate(['/tasks/list']);
          },
          error: () => {
            this.toastr.error('Error al crear la tarea');
          },
        });
      }
    }
  }
}
