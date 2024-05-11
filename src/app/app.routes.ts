import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { MainComponent } from '../pages/main/main.component';
import { LoadingPageComponent } from '@pages/loading-page/loading-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
        path: '',
        component: MainComponent,
        pathMatch: 'full',
        children: [
            { path: '', component: LoadingPageComponent, pathMatch: 'full' },
            { path: '**', redirectTo: '' }
        ]
    },
    { path: '**', redirectTo: '' } // перенаправление на главную страницу, если URL не совпадает ни с одним из путей
];
