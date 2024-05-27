import { Component } from '@angular/core';
import { TaskBrief, TaskGroup, TaskStatus } from '@models/task.model';
import { TasksService } from '@services/tasks.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupCreatorComponent } from '@widgets/group-creator/group-creator.component';
import { TuiButtonModule, TuiDataListModule, TuiDropdownModule, TuiExpandModule, TuiHostedDropdownModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { filter, tap } from 'rxjs';
import { StatusBadgeConfig, getBadgeByStatus } from '@helpers/badge.helpers';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { UserInfoService } from '@services/user.service';
import { UserRole } from '@models/user.model';


@Component({
  selector: 'tasks-menu',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiExpandModule,
    TuiDataListModule,
    TuiSvgModule,
    TuiDropdownModule,
    TuiHostedDropdownModule,
    TuiLoaderModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    GroupCreatorComponent,
    TuiBadgeModule
  ],
  templateUrl: './tasks-menu.component.html',
  styleUrl: './tasks-menu.component.scss'
})
export class TasksMenuComponent {
  public list = [...Array(5).keys()].map((index) => ({
    id: index,
    name: `Item ${index}`
  }));

  public taskGroups: TaskGroup[] = [];
  public expandedGroupIds: number[] = [];
  public _groupActionLoadingId: number | null = null;
  public _taskDeleteLoadingId: string | null = null;
  public _groupToEdit: TaskGroup | null = null;
  private openedTaskId?: string;
  public _isAdmin = false;

  constructor(private route: ActivatedRoute, private tasksService: TasksService, private router: Router, private userInfoService: UserInfoService) {
    this.tasksService.taskGroups$
      .pipe(tap(taskGroups => { 
        this.taskGroups = taskGroups;

        const activeGroup = this.taskGroups.find(group => group.tasks.some(task => task.id === this.openedTaskId));
            
        if (activeGroup && !this.expandedGroupIds.includes(activeGroup.id)) {
          this.expandedGroupIds.push(activeGroup.id);
        }
        
      }))
      .subscribe();

      this.userInfoService.userInfo$
        .pipe(tap(userInfo => { this._isAdmin = userInfo?.role == UserRole.Admin; }))
        .subscribe();

    this.tasksService.getTasks().subscribe();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const childRoute = this.route.firstChild;
        if (childRoute) {
          childRoute.params.subscribe(params => {
            if (!params['taskId']) return;

            this.openedTaskId = params['taskId'];
          });
        }
      });
  }

  public _onExpandedChange(expanded: boolean, group: TaskGroup): void {
    if (expanded) {
      this.expandedGroupIds.push(group.id);
    } else {
      this.expandedGroupIds = this.expandedGroupIds.filter((id) => id !== group.id);
    }
  }

  public _onGroupActionsClick(event: Event): void {
    event.stopPropagation();
  }

  public _deleteGroup(group: TaskGroup): void {
    this._groupActionLoadingId = group.id;

    this.tasksService.deleteGroup(group.id)
      .pipe(tap(() => { this._groupActionLoadingId = null; }))
      .subscribe();
  }

  public _enableGroupRenaming(group: TaskGroup): void {
    this._groupToEdit = group;
  }

  public _finishRenaming(): void {
    this._groupToEdit = null;
  }

  public _createTask(group: TaskGroup): void {
    this.router.navigate(['/create-task'], { queryParams: { groupId: group.id, groupName: group.name } });
  }

  public _deleteTask(event: Event, task: TaskBrief): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this._taskDeleteLoadingId = task.id;

    this.tasksService.deleteTask(task.id).subscribe({
      next: () => {
        this._taskDeleteLoadingId = null;
        this.router.navigate(['']);
      }
    })
  }

  public _getStatusBadgeConfig(status?: TaskStatus): StatusBadgeConfig {
    return getBadgeByStatus(status);
  }
}
