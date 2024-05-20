import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskGroup } from '@models/task.model';
import { CodeEditorModule, CodeModel } from '@ngstack/code-editor';
import { TaskService } from '@services/task.service';
import { TasksService } from '@services/tasks.service';
import { TuiButtonModule, TuiLoaderModule, TuiNotificationModule } from '@taiga-ui/core';
import { TuiTextareaModule } from '@taiga-ui/kit';

@Component({
  selector: 'task-page',
  standalone: true,
  imports: [ReactiveFormsModule, TuiButtonModule, TuiTextareaModule, TuiLoaderModule, CodeEditorModule, TuiNotificationModule],
  templateUrl: './task-page.component.html',
  styleUrl: './task-page.component.scss'
})
export class TaskPageComponent {
  public dataForm: FormGroup;
  public task?: Task;
  public taskGroup?: TaskGroup;
  public descriptionHtml?: SafeHtml;
  public theme = 'vs';
  public code = '# Ваш код'
  public inputData = '';
  public result?: string;
  public error?: string;
  public solved = false;
  public runLoading = false;
  public testLoading = false;

  public model: CodeModel = {
    language: 'python',
    uri: 'main.py',
    value: this.code
  };

  public options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private tasksService: TasksService,
    private sanitizer: DomSanitizer
  ) {
    this.dataForm = this.formBuilder.group({
      inputData: ['']
    });

    this.route.params.subscribe(params => {
      this.taskService.getTask(params['taskId']).subscribe({
        next: (task) => {
          this.task = task;

          this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(task.description);

          this.tasksService.getGroupById(task.group_id).subscribe({
            next: (taskGroup) => {
              this.taskGroup = taskGroup;
            }
          })
        }
      })
    });
  }

  public _editTask(taskId: string): void {
    this.router.navigate([`edit-task/${taskId}`, { data: 'hellp' }])
  }

  public _onCodeChanged(value: string): void {
    this.code = value;
  }

  public _runCode(): void {
    this.solved = false;
    this.result = undefined;

    this.runLoading = true;
    this.taskService.runCode(this.code, this.dataForm.value.inputData).subscribe({
      next: ({ output_data }) => {
        console.log(output_data);
        this.result = output_data;
        this.runLoading = false;
      },
      error: (err: any) => {
        this.error = err.error.error;
        this.runLoading = false;
      }
    })
  }

  public _testCode(): void {
    if (!this.task) return;

    this.solved = false;
    this.result = undefined;
  
    this.testLoading = true;
    this.taskService.testTask(this.code, this.task.id).subscribe({
      next: () => {
        this.result = "Задача решена!";
        this.solved = true;
        this.testLoading = false;
      },
      error: (err: any) => {
        this.error = err.error.error;

        if (err.error.data) {
          this.error = this.error + '\n' + JSON.stringify(err.error.data);
        }
        this.testLoading = false;
      }
    })
  }
}
