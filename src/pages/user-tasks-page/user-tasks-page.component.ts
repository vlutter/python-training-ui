import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskSolutionComponent } from '@components/task-solution/task-solution.component';
import { UserProfileComponent } from '@components/user-profile/user-profile.component';
import { StatusBadgeConfig, getBadgeByStatus } from '@helpers/badge.helpers';
import { TaskGroupWithSolutions, TaskStatus } from '@models/task.model';
import { User } from '@models/user.model';
import { TasksService } from '@services/tasks.service';
import { UsersService } from '@services/users.service';
import { TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAccordionModule, TuiBadgeModule, TuiProgressModule } from '@taiga-ui/kit';
import { tap } from 'rxjs';

@Component({
  selector: 'user-tasks-page',
  standalone: true,
  imports: [TuiAccordionModule, TuiLoaderModule, TaskSolutionComponent, TuiBadgeModule, TuiSvgModule, TuiProgressModule, UserProfileComponent],
  templateUrl: './user-tasks-page.component.html',
  styleUrl: './user-tasks-page.component.scss'
})
export class UserTasksPageComponent {
  public _groups: TaskGroupWithSolutions[] = [];
  public _groupsLoading = false;
  public _userInfo?: User;
  public totalGroupsCount: number = 0;
  public totalTasksCount: number = 0;
  public solvedGroupsCount: number = 0;
  public solvedTasksCount: number = 0;

  private userId?: number;

  constructor(private route: ActivatedRoute, private tasksService: TasksService, private usersService: UsersService) {
    this._groupsLoading = true;
    this.route.params.pipe(
      tap((params) => {
        this.userId = params['userId'];

        this.usersService.getUser(parseInt(params['userId'], 10)).pipe(
          tap((user) => {
            this._userInfo = user;
          })
        ).subscribe();

        this.getTasks();
      })
    ).subscribe()
  }

  public _getStatusBadgeConfig(status?: TaskStatus): StatusBadgeConfig {
    return getBadgeByStatus(status);
  }

  public _getSolvedTasksInGroupCount(group: TaskGroupWithSolutions): number {
    return group.tasks.filter(task => task.status === TaskStatus.Done).length;
  }

  private getTasks(): void {
    if (this.userId === undefined) return;

    this._groupsLoading = true;

    this.tasksService.getTasksByUser(this.userId).pipe(
      tap((groups) => {
        this._groups = groups;
        this._groupsLoading = false;

        this.countProgress();
      })
    ).subscribe();
  }

  private countProgress(): void {
    this.totalGroupsCount = this._groups.length
    this.solvedGroupsCount = this._groups.filter(group => group.status === TaskStatus.Done).length;
  
    [this.totalTasksCount, this.solvedTasksCount] = this._groups.reduce<[number, number]>(([totalSum, solvedSum], group) => {
      return [totalSum + group.tasks.length, solvedSum + group.tasks.filter(task => task.status === TaskStatus.Done).length]
    }, [0, 0])
  }
}
