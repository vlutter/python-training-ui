import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '@models/task.model';
import { TaskService } from '@services/task.service';
import { TasksService } from '@services/tasks.service';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/kit';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { tap } from 'rxjs';

@Component({
  selector: 'create-task-page',
  standalone: true,
  imports: [ReactiveFormsModule, TuiInputModule, TuiTextareaModule, TuiButtonModule, TuiLoaderModule, NgxEditorModule],
  templateUrl: './create-task-page.component.html',
  styleUrl: './create-task-page.component.scss'
})
export class CreateTaskPageComponent implements OnDestroy, OnInit {
  public taskForm: FormGroup;
  public editor: Editor;
  public toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  public groupId?: number;
  public groupName?: string;
  public loading = false;
  public task?: Task;
  public editMode = false;

  get tests(): FormArray {
    return this.taskForm.get('tests') as FormArray;
  }

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      tests: this.fb.array([])
    });

    this.editor = new Editor();
  }

  ngOnInit(): void {
    if (this.route.routeConfig?.path?.includes('edit-task')) {
      this.editMode = true;
      this.taskForm.get('id')?.disable();

      this.taskService.getTask(this.route.snapshot.params['taskId']).subscribe({
        next: (task) => {
          this.task = task;
          this.groupId = task.group_id;

          this.taskForm.setValue({
            id: task.id,
            name: task.name,
            description: task.description,
            tests: []
          })
      
          task.tests.forEach(test => this.tests.push(this.fb.group(test)));

          this.tasksService.getGroupById(task.group_id).subscribe({
            next: (taskGroup) => {
              this.groupName = taskGroup.name;
            }
          })
        }
      })
      
    } else {
      this.route.queryParams.subscribe(params => {
        this.groupId = parseInt(params['groupId'], 10);
        this.groupName = params['groupName'];
      });
    }
  }

  public ngOnDestroy(): void {
    this.editor.destroy();
  }

  public createField(): FormGroup {
    return this.fb.group({
      input_data: ['', Validators.required],
      output_data: ['', Validators.required]
    });
  }

  public addField(): void {
    this.tests.push(this.createField());
  }

  public removeField(index: number): void {
    this.tests.removeAt(index);
  }

  public onSubmit() {
    if (!this.groupId || !this.taskForm.valid) return;

    this.loading = true;

    if (this.editMode && this.task) {
      this.tasksService.editTask({
        id: this.task.id,
        group_id: this.groupId,
        name: this.taskForm.value.name,
        description: this.taskForm.value.description,
        tests: this.taskForm.value.tests
      }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate([this.task?.id])
        }
      })

      return;
    }

    this.tasksService.createTask({
      id: this.taskForm.value.id,
      group_id: this.groupId,
      name: this.taskForm.value.name,
      description: this.taskForm.value.description,
      tests: this.taskForm.value.tests
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.taskForm.value.id])
      }
    })
  }
}
