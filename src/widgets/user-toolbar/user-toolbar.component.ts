import { Component, OnInit } from '@angular/core';
import { GravatarComponent } from '@components/gravatar/gravatar.component';
import { AuthService } from '@services/auth.service';
import { UserInfoService } from '@services/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { User } from '@models/user.model';

@Component({
    selector: 'user-toolbar',
    standalone: true,
    templateUrl: './user-toolbar.component.html',
    styleUrl: './user-toolbar.component.scss',
    imports: [GravatarComponent, MatMenuModule, MatButtonModule]
})
export class UserToolbarComponent implements OnInit {
  public userInfo: User | null = null;

  constructor(private authService: AuthService, private userInfoService: UserInfoService) {}

  public ngOnInit(): void {
    this.userInfoService.userInfo$.subscribe((userInfo) => {
      this.userInfo = userInfo;
    });
  }

  public logout() {
    this.authService.logout();
  }

}
