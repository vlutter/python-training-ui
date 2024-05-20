import { Component, OnInit } from '@angular/core';
import { GravatarComponent } from '@components/gravatar/gravatar.component';
import { AuthService } from '@services/auth.service';
import { UserInfoService } from '@services/user.service';
import { User } from '@models/user.model';
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule } from '@taiga-ui/core';

@Component({
    selector: 'user-toolbar',
    standalone: true,
    templateUrl: './user-toolbar.component.html',
    styleUrl: './user-toolbar.component.scss',
    imports: [GravatarComponent, TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule]
})
export class UserToolbarComponent implements OnInit {
  public userInfo: User | null = null;

  constructor(private authService: AuthService, private userInfoService: UserInfoService) {}

  public ngOnInit(): void {
    this.userInfoService.userInfo$.subscribe((userInfo) => {
      this.userInfo = userInfo;
    });

    this.userInfoService.getUserInfo().subscribe();
  }

  public logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }

}
