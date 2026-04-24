import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./components/auth/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./components/auth/register/register').then(m => m.Register) },
    { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard) },
    //Employe routes//
    { path: 'employes', loadComponent: () => import('./components/managment/agents/list-agents/list-agents').then(m => m.ListAgents) },
    { path: 'employes/add', loadComponent: () => import('./components/managment/agents/add-agents/add-agents').then(m => m.AddAgents) },
    { path: 'employes/:id', loadComponent: () => import('./components/managment/agents/details-agents/details-agents').then(m => m.DetailsAgents) },
    { path: 'employes/modifier/:id', loadComponent: () => import('./components/managment/agents/add-agents/add-agents').then(m => m.AddAgents) },
    //Mouvement personnel//
    { path: 'mouvement-personnel', loadComponent: () => import('./components/managment/mouvementDuPersonnel/liste-mouvement/liste-mouvement').then(m => m.ListeMouvement) },
    { path: 'add-mouvement', loadComponent: () => import('./components/managment/mouvementDuPersonnel/add-mouvement/add-mouvement').then(m => m.AddMouvement) },
    { path: 'detail-mouvement-personnel/:id', loadComponent: () => import('./components/managment/mouvementDuPersonnel/detail-mouvement/detail-mouvement').then(m => m.DetailMouvement) },
    //Projet routes//
    { path: 'projets', loadComponent: () => import('./components/managment/projets/liste-projets/liste-projets').then(m => m.ListeProjets) },
];
