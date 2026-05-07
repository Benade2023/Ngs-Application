import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./components/auth/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./components/auth/register/register').then(m => m.Register) },
    { path: 'forgate-password', loadComponent: () => import('./components/auth/forgate-password/forgate-password').then(m => m.ForgatePassword) },
    { path: 'contact-administrator', loadComponent: () => import('./components/auth/contact-administrator/contact-administrator').then(m => m.ContactAdministrator) },
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
    //Rapport routes//
    { path: 'rapports/:projetId', loadComponent: () => import('./components/managment/projets/rapports/list-rapports/list-rapports').then(m => m.ListRapports) },
    { path: 'detail-rapport/:rapportId', loadComponent: () => import('./components/managment/projets/rapports/detail-rapports/detail-rapports').then(m => m.DetailRapports) },
    { path: 'add-rapport/:projetId', loadComponent: () => import('./components/managment/projets/rapports/new-rapport/new-rapport').then(m => m.NewRapport) },
    //Magasin routes//
    { path: 'magasin', loadComponent: () => import('./components/managment/magasin/gestion-magasin/gestion-magasin').then(m => m.GestionMagasin) },
    //Presence-Absence//
    { path: 'presence-control', loadComponent: () => import('./components/managment/presence-absence/presence-absence').then(m => m.PresenceAbsence) }
];
