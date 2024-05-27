import { Component } from '@angular/core';
import { TuiDataListModule } from '@taiga-ui/core';
import { tap } from 'rxjs';
import { User } from '@models/user.model';
import { UsersService } from '@services/users.service';
import { UserProfileComponent } from '@components/user-profile/user-profile.component';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'users-menu',
  standalone: true,
  imports: [
    TuiDataListModule,
    RouterLink,
    RouterLinkActive,
    UserProfileComponent
  ],
  templateUrl: './users-menu.component.html',
  styleUrl: './users-menu.component.scss'
})
export class UsersMenuComponent {
  public users: User[] = [];

  constructor(private usersService: UsersService) {
    this.usersService.users$
      .pipe(tap(users => { this.users = users; }))
      .subscribe();

    this.usersService.getUsers().subscribe();
  }
}
