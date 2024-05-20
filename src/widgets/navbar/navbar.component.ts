import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { GravatarComponent } from '@components/gravatar/gravatar.component';
import { UserToolbarComponent } from "@widgets/user-toolbar/user-toolbar.component";
import { LogoComponent } from "@components/logo/logo.component";

@Component({
    selector: 'navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    imports: [GravatarComponent, UserToolbarComponent, LogoComponent]
})
export class NavbarComponent  implements OnInit {
  public loggedIn = false;

  constructor(private router: Router, private authService: AuthService) {}

  public ngOnInit(): void {
    this.authService.loggedIn$.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
      if (!loggedIn) {
        this.router.navigate(['/login']);
      }
    });
  }
}
