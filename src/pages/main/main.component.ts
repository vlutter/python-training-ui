import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@widgets/navbar/navbar.component';
import { TasksMenuComponent } from "@widgets/tasks-menu/tasks-menu.component";

@Component({
    selector: 'main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    imports: [RouterOutlet, NavbarComponent, TasksMenuComponent],
})
export class MainComponent {
  constructor() {}
}
