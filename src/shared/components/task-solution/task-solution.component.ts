import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskSolutionOutput, TaskStatus } from '@models/task.model';
import { TuiNotificationModule } from '@taiga-ui/core';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@Component({
  selector: 'task-solution',
  standalone: true,
  imports: [TuiNotificationModule, FormsModule, MonacoEditorModule],
  templateUrl: './task-solution.component.html',
  styleUrl: './task-solution.component.scss'
})
export class TaskSolutionComponent {
  @Input()
  public id: string = 'solution';

  @Input()
  public status?: TaskStatus;

  @Input()
  public output?: TaskSolutionOutput;

  @Input()
  public solution?: string;

  public editorOptions = {theme: 'vs', language: 'python', readonly: true };

  public _stringify(obj: any): string {
    return JSON.stringify(obj);
  } 
}
