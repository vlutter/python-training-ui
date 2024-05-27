import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserRole } from '@models/user.model';
import { UserInfoService } from '@services/user.service';
import { TuiTabsModule } from '@taiga-ui/kit';
import { NavbarComponent } from '@widgets/navbar/navbar.component';
import { TasksMenuComponent } from "@widgets/tasks-menu/tasks-menu.component";
import { UsersMenuComponent } from '@widgets/users-menu/users-menu.component';
import { tap } from 'rxjs';

type MainMenuTab = 'tasks' | 'users';

@Component({
    selector: 'main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    imports: [RouterOutlet, RouterLink, NavbarComponent, TasksMenuComponent, UsersMenuComponent, TuiTabsModule, NgTemplateOutlet],
})
export class MainComponent {
  public _isAdmin = false;
  public _activeTab: MainMenuTab = 'tasks';

  constructor(private userInfoService: UserInfoService) {
    this.userInfoService.userInfo$.pipe(
      tap(userInfo => { this._isAdmin= userInfo?.role === UserRole.Admin })
    ).subscribe();
  }

  public _onTabClick(tab: MainMenuTab): void {
    this._activeTab = tab;
  }
}
