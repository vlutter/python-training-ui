import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TasksService } from '@services/tasks.service';
import { TuiLoaderModule } from '@taiga-ui/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'loading-page',
  standalone: true,
  imports: [TuiLoaderModule],
  templateUrl: './loading-page.component.html',
  styleUrl: './loading-page.component.scss'
})
export class LoadingPageComponent implements OnDestroy {
  private tasksSubscription: Subscription;

  constructor(private router: Router, private tasksService: TasksService) {
    this.tasksSubscription = this.tasksService.taskGroups$.subscribe((taskGroups) => {
      if (taskGroups.length && taskGroups[0].tasks.length) {

        console.info('Navigate to ', `task/${taskGroups[0].tasks[0].id}`)
        this.router.navigate(['task', taskGroups[0].tasks[0].id]);
      }
    });
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }
}
