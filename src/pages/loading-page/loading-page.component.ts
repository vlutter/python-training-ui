import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TasksService } from '@services/tasks.service';
import { TuiLoaderModule } from '@taiga-ui/core';


@Component({
  selector: 'loading-page',
  standalone: true,
  imports: [TuiLoaderModule],
  templateUrl: './loading-page.component.html',
  styleUrl: './loading-page.component.scss'
})
export class LoadingPageComponent {
  constructor(private router: Router, private tasksService: TasksService) {}

  public ngOnInit(): void {
    this.tasksService.taskGroups$.subscribe((taskGroups) => {
      console.log(taskGroups);
      
      if (taskGroups.length && taskGroups[0].tasks.length) {
        console.log(taskGroups[0].tasks.length);
        
        this.router.navigate([taskGroups[0].tasks[0].id]);
      }
    });
  }
}
