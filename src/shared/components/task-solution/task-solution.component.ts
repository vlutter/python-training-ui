import { Component, Input } from '@angular/core';
import { TaskSolutionOutput, TaskStatus } from '@models/task.model';
import { CodeEditorModule } from '@ngstack/code-editor';
import { TuiNotificationModule } from '@taiga-ui/core';

@Component({
  selector: 'task-solution',
  standalone: true,
  imports: [CodeEditorModule, TuiNotificationModule],
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

  public _stringify(obj: any): string {
    return JSON.stringify(obj);
  } 
}
