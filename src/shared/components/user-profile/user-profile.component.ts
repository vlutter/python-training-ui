import { Component, Input } from '@angular/core';
import { GravatarComponent } from '@components/gravatar/gravatar.component';
import { User } from '@models/user.model';

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [GravatarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  @Input()
  public name?: string;

  @Input()
  public email?: string;

  @Input()
  public leftOrientation = false;
}
