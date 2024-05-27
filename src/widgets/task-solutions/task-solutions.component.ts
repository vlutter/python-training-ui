import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TaskSolutionComponent } from '@components/task-solution/task-solution.component';
import { UserProfileComponent } from '@components/user-profile/user-profile.component';
import { StatusBadgeConfig, getBadgeByStatus } from '@helpers/badge.helpers';
import { Task, TaskSolution, TaskStatus } from '@models/task.model';
import { TaskService } from '@services/task.service';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiAccordionModule, TuiBadgeModule } from '@taiga-ui/kit';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'task-solutions',
  standalone: true,
  imports: [TuiAccordionModule, UserProfileComponent, TuiBadgeModule, TuiSvgModule, TaskSolutionComponent],
  templateUrl: './task-solutions.component.html',
  styleUrl: './task-solutions.component.scss'
})
export class TaskSolutionsComponent implements OnChanges {
  @Input()
  public task?: Task;

  public _taskSolutions: TaskSolution[] = [];

  private taskSolutionsSubscription: Subscription | null = null;

  constructor(private taskService: TaskService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && changes['task'].currentValue) {
      this.taskSolutionsSubscription?.unsubscribe();

      this.taskSolutionsSubscription = this.taskService.taskSolutions$
        .pipe(tap(taskSolutions => { this._taskSolutions = taskSolutions }))
        .subscribe();

      this.taskService.getTaskSolutions(changes['task'].currentValue.id).subscribe();
    }
  }

  public _getStatusBadgeConfig(status?: TaskStatus): StatusBadgeConfig {
    return getBadgeByStatus(status);
  }

  public _stringify(obj: any): string {
    return JSON.stringify(obj);
  } 
}
