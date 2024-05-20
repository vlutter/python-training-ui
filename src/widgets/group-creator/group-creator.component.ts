import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskGroup } from '@models/task.model';
import { TasksService } from '@services/tasks.service';
import { TuiButtonModule, TuiLoaderModule, TuiModeModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';



@Component({
  selector: 'group-creator',
  standalone: true,
  imports: [ReactiveFormsModule, TuiButtonModule, TuiInputModule, TuiTextfieldControllerModule, TuiLoaderModule, TuiModeModule],
  templateUrl: './group-creator.component.html',
  styleUrl: './group-creator.component.scss'
})
export class GroupCreatorComponent implements OnChanges {
  @Input()
  public group?: TaskGroup;

  @Output()
  public finish = new EventEmitter<void>();

  public groupForm: FormGroup;
  public _inputEnabled = false;
  public _loading = false;

  constructor(private fb: FormBuilder, private tasksService: TasksService) {
    this.groupForm = this.fb.group({
      name: [this.group?.name ?? '', [Validators.required]],
    });
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['group']) {
      console.log(this.group);
      this.groupForm.controls['name'].setValue(this.group?.name);
    }
  }

  public _onAddGroupClick(): void {
    this._inputEnabled = true;
  }

  public _onCreateGroup(): void {
    if (!this.groupForm.valid) return;
  
    const name = this.groupForm.value.name;

    this._loading = true;

    if (this.group) {
      this.tasksService.editGroup(this.group.id, name).subscribe({
        next: () => {
          this.finish.emit();
          this._loading = false;
        },
        error: (response) => {
          console.error(response);
          this._loading = false;
        }
      });

      return;
    }

    this.tasksService.createGroup(name).subscribe({
      next: () => {
        this._inputEnabled = false;
        this._loading = false;
      },
      error: (response) => {
        console.error(response);
        this._loading = false;
      }
    });
  }

  public _onCancel(event: Event): void {
    event.stopPropagation();

    if (this.group) {
      this.finish.emit();
    }

    this._inputEnabled = false;
  }
}
