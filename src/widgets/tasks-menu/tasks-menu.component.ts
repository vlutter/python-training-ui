import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TaskGroup } from '@models/task.model';
import { TasksService } from '@services/tasks.service';


@Component({
  selector: 'tasks-menu',
  standalone: true,
  imports: [MatExpansionModule, MatListModule, MatIconModule],
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

  constructor(private tasksService: TasksService) {
    this.tasksService.getTasks().subscribe({
      next: (taskGroups) => {
        this.taskGroups = taskGroups;
      },
      error: (response) => {
        console.log(response.error);
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
}
