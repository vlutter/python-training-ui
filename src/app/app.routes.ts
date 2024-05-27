import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { MainComponent } from '../pages/main/main.component';
import { LoadingPageComponent } from '@pages/loading-page/loading-page.component';
import { TaskPageComponent } from '@pages/task-page/task-page.component';
import { CreateTaskPageComponent } from '@pages/create-task-page/create-task-page.component';
import { UserTasksPageComponent } from '@pages/user-tasks-page/user-tasks-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
        path: '',
        component: MainComponent,
        children: [
            { path: '', component: LoadingPageComponent, pathMatch: 'full' },
            { path: 'create-task', component: CreateTaskPageComponent },
            { path: 'edit-task/:taskId', component: CreateTaskPageComponent },
            { path: 'task/:taskId', component: TaskPageComponent },
            { path: 'user/:userId', component: UserTasksPageComponent },
            { path: '**', redirectTo: '' }
        ]
    },
    { path: '**', redirectTo: 'main' }
];
