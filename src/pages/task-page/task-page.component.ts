import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusBadgeConfig, getBadgeByStatus } from '@helpers/badge.helpers';
import { Task, TaskGroup, TaskStatus } from '@models/task.model';
import { UserRole } from '@models/user.model';
import { CodeEditorModule, CodeModel } from '@ngstack/code-editor';
import { TaskService } from '@services/task.service';
import { TasksService } from '@services/tasks.service';
import { UserInfoService } from '@services/user.service';
import { TuiButtonModule, TuiLoaderModule, TuiNotificationModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiBadgeModule, TuiTabsModule, TuiTextareaModule } from '@taiga-ui/kit';
import { tap } from 'rxjs';
import { DCATaskPageTab } from './task-page.model';
import { NgTemplateOutlet } from '@angular/common';
import { TaskSolutionsComponent } from "@widgets/task-solutions/task-solutions.component";

@Component({
    selector: 'task-page',
    standalone: true,
    templateUrl: './task-page.component.html',
    styleUrl: './task-page.component.scss',
    imports: [
        NgTemplateOutlet,
        ReactiveFormsModule,
        TuiButtonModule,
        TuiTextareaModule,
        TuiLoaderModule,
        CodeEditorModule,
        TuiNotificationModule,
        TuiBadgeModule,
        TuiSvgModule,
        TuiTabsModule,
        TaskSolutionsComponent
    ]
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
  public statusBadgeConfig?: StatusBadgeConfig;
  public _isAdmin = false;
  public _activeTab: DCATaskPageTab = 'condition';

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
    private sanitizer: DomSanitizer,
    private userInfoService: UserInfoService
  ) {
    this.dataForm = this.formBuilder.group({
      inputData: ['']
    });

    this.route.params.subscribe(params => {
      this.taskService.getTask(params['taskId']).subscribe()
    });

    this.taskService.task$.subscribe({
      next: (task) => {
        if (!task) return;

        this.task = task;
        this.statusBadgeConfig = getBadgeByStatus(task?.status);

        if (task?.last_solution) {
          this.model = {
            ...this.model,
            value: task.last_solution
          };
        } else {
          this.model = {
            ...this.model,
            value: '# Ваш код'
          };
        }

        this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(task.description);

        this.tasksService.getGroupById(task.group_id).subscribe({
          next: (taskGroup) => {
            this.taskGroup = taskGroup;
          }
        })
      }
    })



    this.userInfoService.userInfo$
      .pipe(tap(userInfo => { this._isAdmin = userInfo?.role == UserRole.Admin; }))
      .subscribe();
  }

  public _editTask(taskId: string): void {
    this.router.navigate([`edit-task/${taskId}`, { data: 'hellp' }])
  }

  public _onCodeChanged(value: string): void {
    this.code = value;
  }

  public _runCode(): void {
    if (!this.task) return;

    this.solved = false;
    this.result = undefined;

    this.runLoading = true;
    this.taskService.runCode(this.code, this.dataForm.value.inputData, this.task.id).subscribe({
      next: ({ output_data }) => {
        this.result = output_data;
        this.runLoading = false;

        this.updateTasks();
      },
      error: (err: any) => {
        this.error = err.error.error;
        this.runLoading = false;

        this.updateTasks();
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

        this.updateTasks();
      },
      error: (err: any) => {
        this.error = err.error.error;

        if (err.error.data) {
          this.error = this.error + '\n' + JSON.stringify(err.error.data);
        }
        this.testLoading = false;

        this.updateTasks();
      }
    })
  }

  public _onTabClick(tab: DCATaskPageTab) {
    this._activeTab = tab;
  }

  private updateStatus(status: TaskStatus, code: string): void {
    if (!this.task) return;

    this.taskService.setTask({
      ...this.task,
      status: status,
      last_solution: code
    });
  }

  private updateTasks(): void {
    if (!this.task) return;

    this.tasksService.getTasks().subscribe();
    this.taskService.getTask(this.task.id).subscribe()
  }
}
