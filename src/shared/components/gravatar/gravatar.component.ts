import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { sha256 } from 'js-sha256';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'gravatar',
  standalone: true,
  imports: [],
  templateUrl: './gravatar.component.html',
  styleUrl: './gravatar.component.scss',
})
export class GravatarComponent implements OnChanges {
  @Input()
  public email?: string;

  public _url?: string;

  constructor(private http: HttpClient) {}
  
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['email'] && changes['email'].currentValue) {
      this._url = undefined;
      const hash = sha256(changes['email'].currentValue.trim().toLowerCase());
      
      this.loadImage(hash);
    }
  }

  private loadImage(hash: string) {
    console.log(hash);
    this.http.get<Blob>(`https://gravatar.com/avatar/${hash}?d=monsterid`, { responseType: 'blob' as 'json' }).subscribe({
      next: (response) => {
        const urlCreator = window.URL || window.webkitURL;
        this._url = urlCreator.createObjectURL(response);
      },
      error: (error) => console.log(error)
    })
  }
}
