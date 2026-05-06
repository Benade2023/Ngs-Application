import{a as W}from"./chunk-7PWD2ILJ.js";import{a as U}from"./chunk-REDI7654.js";import{b as $,c as A,f as V,r as N,s as B}from"./chunk-ROMY2I6U.js";import{b as G}from"./chunk-BS52MASR.js";import{g as q,i as z}from"./chunk-FQRUUZP3.js";import{i as j,j as F,m as T,q as L}from"./chunk-6IFPUJXU.js";import{$ as h,Ab as E,Bb as P,Cb as y,Db as i,Eb as c,Fb as p,Gb as C,Ia as r,Ib as S,Jb as D,Kb as R,Ta as x,Ya as I,Zb as k,aa as b,bb as u,kb as m,lb as n,mb as e,nb as M,qb as O,ra as w,tb as g,ub as v}from"./chunk-T2J4EGTX.js";function Y(l,a){if(l&1&&(n(0,"span",49),i(1),e()),l&2){let t=a.$implicit;r(),C(" ",t.nom," (",t.fonction,") ")}}function H(l,a){if(l&1&&(n(0,"span",59),i(1),e()),l&2){let t=a.$implicit;r(),p(" ",t," ")}}function Q(l,a){if(l&1&&(n(0,"div",50)(1,"div",51)(2,"span",52),i(3),e(),n(4,"span",53),i(5),e()(),n(6,"div",54),M(7,"div",55),e(),n(8,"div",56)(9,"span",57),i(10,"Executeurs :"),e(),u(11,H,2,1,"span",58),e()()),l&2){let t=a.$implicit,o=v(2);r(3),c(t.tache),r(),y(o.getAvancementClass(t.avancement)),r(),p(" ",t.avancement,"% "),r(2),E("width",t.avancement,"%"),r(4),m("ngForOf",t.executeurs)}}function K(l,a){if(l&1){let t=O();n(0,"div",28)(1,"div",29)(2,"div",30)(3,"h3"),i(4),e(),n(5,"span",31),i(6),e()(),n(7,"div",32)(8,"button",33),g("click",function(){let s=h(t).$implicit,d=v();return b(d.openDetailModal(s))}),i(9," \u{1F441}\uFE0F "),e(),n(10,"button",34),g("click",function(){let s=h(t).$implicit,d=v();return b(d.viewRapportDetails(s))}),i(11," \u270F\uFE0F "),e()()(),n(12,"div",35)(13,"div",36)(14,"div",37)(15,"label"),i(16,"\u{1F454} Superviseur client"),e(),n(17,"span"),i(18),e()(),n(19,"div",37)(20,"label"),i(21,"\u{1F477} Chef d'\xE9quipe"),e(),n(22,"span"),i(23),e()(),n(24,"div",37)(25,"label"),i(26,"\u{1F465} Effectif"),e(),n(27,"span"),i(28),e()(),n(29,"div",37)(30,"label"),i(31,"\u{1F4CA} Avancement moyen"),e(),n(32,"span",38),i(33),e()()(),n(34,"div",39)(35,"label"),i(36,"\xC9quipe sur site :"),e(),n(37,"div",40),u(38,Y,2,2,"span",41),e()(),n(39,"div",42)(40,"label"),i(41,"Travaux r\xE9alis\xE9s :"),e(),n(42,"div",43),u(43,Q,12,7,"div",44),e()(),n(44,"div",45)(45,"div",46)(46,"label"),i(47,"\u{1F4E6} Mobilisation"),e(),n(48,"span"),i(49),e()(),n(50,"div",46)(51,"label"),i(52,"\u{1F4E4} D\xE9mobilisation"),e(),n(53,"span"),i(54),e()()(),n(55,"div",47)(56,"div",48),i(57),e()()()()}if(l&2){let t=a.$implicit,o=v();r(4),c(t.projet),r(2),c(o.formatDate(t.date)),r(12),c(t.superviseurClient),r(5),c(t.chefEquipe),r(5),p("",t.equipe.totalPax," personnes"),r(5),p("",o.getMoyenneAvancement(t),"%"),r(5),m("ngForOf",t.equipe.pax),r(5),m("ngForOf",t.travaux),r(6),c(t.logistique.mobilisation),r(5),c(t.logistique.demobilisation),r(2),P("signe",t.validation.signe),r(),p(" ",t.validation.signe?"\u2705 Valid\xE9 par "+t.validation.nom:"\u23F3 En attente de validation"," ")}}function X(l,a){if(l&1){let t=O();n(0,"div",60)(1,"button",61),g("click",function(){h(t);let s=v();return b(s.previousPage())}),i(2,"\u25C0 Pr\xE9c\xE9dent"),e(),n(3,"span"),i(4),e(),n(5,"button",61),g("click",function(){h(t);let s=v();return b(s.nextPage())}),i(6,"Suivant \u25B6"),e()()}if(l&2){let t=v();r(),m("disabled",t.currentPage===1),r(3),C("Page ",t.currentPage," sur ",t.totalPages),r(),m("disabled",t.currentPage===t.totalPages)}}function Z(l,a){if(l&1&&(n(0,"tr")(1,"td"),i(2),e(),n(3,"td"),i(4),e()()),l&2){let t=a.$implicit;r(2),c(t.nom),r(2),c(t.fonction)}}function tt(l,a){if(l&1&&(n(0,"div",76)(1,"div",77)(2,"strong"),i(3),e(),n(4,"span",78),i(5),e()(),n(6,"div",56)(7,"strong"),i(8,"Executeurs :"),e(),i(9),e(),n(10,"div",54),M(11,"div",55),e()()),l&2){let t=a.$implicit,o=v(2);r(3),c(t.tache),r(),y(o.getAvancementClass(t.avancement)),r(),p(" ",t.avancement,"% "),r(4),p(" ",t.executeurs.join(", ")," "),r(2),E("width",t.avancement,"%")}}function et(l,a){if(l&1&&(n(0,"div",81)(1,"p"),i(2),e()()),l&2){let t=a.$implicit;r(2),c(t.titre)}}function nt(l,a){if(l&1&&(n(0,"div",65)(1,"h4"),i(2,"\u{1F4F8} Galerie photo"),e(),n(3,"div",79),u(4,et,3,1,"div",80),e()()),l&2){let t=v(2);r(4),m("ngForOf",t.selectedRapport.photos)}}function it(l,a){if(l&1&&(n(0,"span"),i(1),e()),l&2){let t=v(2);r(),C(" \u2705 Sign\xE9 par ",t.selectedRapport.validation.nom," (",t.selectedRapport.validation.fonction,") ")}}function at(l,a){l&1&&(n(0,"span"),i(1,"\u23F3 En attente de signature"),e())}function rt(l,a){if(l&1&&(n(0,"div",62)(1,"div",63)(2,"h2"),i(3),e(),n(4,"p",64),i(5),e()(),n(6,"div",65)(7,"h4"),i(8,"\u{1F465} Encadrement"),e(),n(9,"div",66)(10,"div")(11,"strong"),i(12,"Superviseur client :"),e(),i(13),e(),n(14,"div")(15,"strong"),i(16,"Chef d'\xE9quipe :"),e(),i(17),e(),n(18,"div")(19,"strong"),i(20,"Effectif total :"),e(),i(21),e()()(),n(22,"div",65)(23,"h4"),i(24,"\u{1F477} \xC9quipe d\xE9taill\xE9e"),e(),n(25,"table",67)(26,"thead")(27,"tr")(28,"th"),i(29,"Nom"),e(),n(30,"th"),i(31,"Fonction"),e()()(),n(32,"tbody"),u(33,Z,5,2,"tr",68),e()()(),n(34,"div",65)(35,"h4"),i(36,"\u{1F6E1}\uFE0F S\xE9curit\xE9"),e(),n(37,"div",69)(38,"span",70),i(39),e(),n(40,"p"),i(41),e()()(),n(42,"div",65)(43,"h4"),i(44,"\u{1F527} Travaux r\xE9alis\xE9s"),e(),u(45,tt,12,7,"div",71),e(),u(46,nt,5,1,"div",72),n(47,"div",65)(48,"h4"),i(49,"\u{1F4E6} Logistique & Mobilisation"),e(),n(50,"div",66)(51,"div")(52,"strong"),i(53,"Mobilisation :"),e(),i(54),e(),n(55,"div")(56,"strong"),i(57,"D\xE9mobilisation :"),e(),i(58),e(),n(59,"div")(60,"strong"),i(61,"Personnel :"),e(),i(62),e(),n(63,"div")(64,"strong"),i(65,"Mat\xE9riel :"),e(),i(66),e()()(),n(67,"div",73)(68,"div",74)(69,"strong"),i(70,"Validation :"),e(),u(71,it,2,2,"span",75)(72,at,2,0,"span",75),e()()()),l&2){let t=v();r(3),c(t.selectedRapport.projet),r(2),p("Date : ",t.formatDate(t.selectedRapport.date)),r(8),p(" ",t.selectedRapport.superviseurClient),r(4),p(" ",t.selectedRapport.chefEquipe),r(4),p(" ",t.selectedRapport.equipe.totalPax," personnes"),r(12),m("ngForOf",t.selectedRapport.equipe.pax),r(5),P("respectee",t.selectedRapport.securite.reglesRespectees),r(),p(" ",t.selectedRapport.securite.reglesRespectees?"\u2705 R\xE8gles respect\xE9es":"\u274C Non-conformit\xE9s"," "),r(2),c(t.selectedRapport.securite.remarques),r(4),m("ngForOf",t.selectedRapport.travaux),r(),m("ngIf",t.selectedRapport.photos.length),r(8),p(" ",t.selectedRapport.logistique.mobilisation),r(4),p(" ",t.selectedRapport.logistique.demobilisation),r(4),p(" ",t.selectedRapport.logistique.personnel.join(", ")||"-"),r(4),p(" ",t.selectedRapport.logistique.materiel.join(", ")||"-"),r(5),m("ngIf",t.selectedRapport.validation.signe),r(),m("ngIf",!t.selectedRapport.validation.signe)}}var J=class l{constructor(a,t,o,s,d,f,_){this.platformId=a;this.router=t;this.route=o;this.rapportService=s;this.cdr=d;this.alert=f;this.projetService=_;this.isBrowser=L(this.platformId)}platformId;router;route;rapportService;cdr;alert;projetService;rapports=[];filteredRapports=[];projets=[];searchTerm="";selectedProjet="";selectedDate="";currentPage=1;itemsPerPage=10;totalPages=1;isBrowser;currentProjetId="";showDetailModal=!1;selectedRapport=null;stats={total:0,totalPax:0,travauxEnCours:0,travauxTermines:0};ngOnInit(){let a=this.route.snapshot.params.projetId;this.currentProjetId=a,a&&(this.loadData(a),this.loadProjets(a))}loadData(a){this.rapportService.getRapports().subscribe({next:t=>{let o=t.sort((s,d)=>new Date(d.date).getTime()-new Date(s.date).getTime());this.rapports=o.filter(s=>s.projetId===a),console.log(this.rapports),this.calculateStats(),this.applyFilters(),this.cdr.markForCheck()},error:t=>{console.error("Erreur lors du chargement des rapports:",t)}})}loadProjets(a){this.projetService.getProjets().subscribe({next:t=>{this.projets=t.filter(o=>o.id===a)},error:t=>{console.error("Erreur chargement projets:",t)}})}addRapport(){this.router.navigate(["/add-rapport",this.currentProjetId])}calculateStats(){this.stats.total=this.rapports.length,this.stats.totalPax=this.rapports.reduce((a,t)=>a+(t.equipe.totalPax||0),0),this.stats.travauxEnCours=this.rapports.filter(a=>a.travaux.some(t=>t.avancement<100)).length,this.stats.travauxTermines=this.rapports.filter(a=>a.travaux.every(t=>t.avancement===100)).length}formatDate(a){let t=new Date(a);return`${t.getDate().toString().padStart(2,"0")}/${(t.getMonth()+1).toString().padStart(2,"0")}/${t.getFullYear()}`}getAvancementClass(a){return a===100?"complet":a>=75?"tres-avance":a>=50?"mi-parcours":a>=25?"commence":"debut"}applyFilters(){let a=[...this.rapports];if(this.selectedProjet&&(a=a.filter(o=>o.projet===this.selectedProjet)),this.selectedDate){let o=new Date(this.selectedDate);a=a.filter(s=>new Date(s.date).toDateString()===o.toDateString())}if(this.searchTerm){let o=this.searchTerm.toLowerCase();a=a.filter(s=>s.projet.toLowerCase().includes(o)||s.superviseurClient.toLowerCase().includes(o)||s.chefEquipe.toLowerCase().includes(o)||s.travaux.some(d=>d.tache.toLowerCase().includes(o)))}this.totalPages=Math.ceil(a.length/this.itemsPerPage),this.currentPage>this.totalPages&&this.totalPages>0&&(this.currentPage=this.totalPages);let t=(this.currentPage-1)*this.itemsPerPage;this.filteredRapports=a.slice(t,t+this.itemsPerPage)}resetFilters(){this.selectedProjet="",this.selectedDate="",this.searchTerm="",this.currentPage=1,this.applyFilters()}previousPage(){this.currentPage>1&&(this.currentPage--,this.applyFilters())}nextPage(){this.currentPage<this.totalPages&&(this.currentPage++,this.applyFilters())}openDetailModal(a){this.selectedRapport=a,this.showDetailModal=!0}closeDetailModal(){this.showDetailModal=!1,this.selectedRapport=null}closeModalOnOutside(a){a.target.classList.contains("modal")&&this.closeDetailModal()}viewRapportDetails(a){this.router.navigate(["/rapport-detail",a.id])}getMoyenneAvancement(a){if(!a.travaux.length)return 0;let t=a.travaux.reduce((o,s)=>o+s.avancement,0);return Math.round(t/a.travaux.length)}printRapport(a){let t=window.open("","_blank","width=1200,height=900");if(!t)return;let o=f=>["Janvier","F\xE9vrier","Mars","Avril","Mai","Juin","Juillet","Ao\xFBt","Septembre","Octobre","Novembre","D\xE9cembre"][f],s=f=>{let _=new Date(f);return`${_.getDate().toString().padStart(2,"0")} ${o(_.getMonth())} ${_.getFullYear()}`},d=`
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport Journalier</title>

<style>

@page {
    size: A4;
    margin: 140px 25px 90px 25px;
}

body{
    font-family: Arial, sans-serif;
    font-size: 12px;
    color:#000;
}

header{
    position: fixed;
    top:-120px;
    left:0;
    right:0;
    height:110px;
}

footer{
    position: fixed;
    bottom:-70px;
    left:0;
    right:0;
    height:60px;
    font-size:10px;
    text-align:center;
    color:green;
}

table{
    width:100%;
    border-collapse: collapse;
}

th, td{
    border:1px solid #000;
    padding:6px;
}

th{
    background:#4F81BD;
    color:white;
}

.section-title{
    font-size:18px;
    font-weight:bold;
    color:#4F81BD;
    margin-top:20px;
    margin-bottom:10px;
}

.center{
    text-align:center;
}

.page-break{
    page-break-before:always;
}

</style>
</head>

<body>

<header>

<table style="border:none;">
<tr style="border:none;">
<td style="border:none;width:20%;">
<img src="assets/images/logo-ngs.png" width="120">
</td>

<td style="border:none;width:80%; text-align:center;">
<div style="font-size:28px;font-weight:bold;">NGOULOU-SERVICES</div>
<div style="font-size:18px;">
Electricit\xE9 HTA - BT. Automatisme / Instrumentation
</div>
<div style="font-size:18px;">
Et Fibre Optique
</div>
</td>
</tr>
</table>

<hr>

</header>


<footer>

Ce document est la propri\xE9t\xE9 de NGOULOU SERVICES. Il ne peut \xEAtre reproduit ni transmis \xE0 des tiers sans autorisation \xE9crite de la SOCIETE.<br>

Soci\xE9t\xE9 NGS - Si\xE8ge Quartier Kurou, Port-Gentil - Gabon N\xB0STATISQUE : 039999 A RG/POG 2015B 1710<br>

Tel : 07540432 \u2013 02 93 49 93 | Site Internet : ngservices.info | Email : projets@ngservices.info

</footer>


<main>

<div class="center" style="margin-bottom:25px;">
<h2 style="color:#4F81BD;">RAPPORT JOURNALIER</h2>
<h3>Projet : ${a.projet}</h3>
<h3>Date du : ${s(a.date)}</h3>
</div>


<table>
<tr>
<th>Superviseur client</th>
<td>${a.superviseurClient}</td>
</tr>

<tr>
<th>Chef d'\xE9quipe</th>
<td>${a.chefEquipe}</td>
</tr>

<tr>
<th>Effectif (POB)</th>
<td>${a.equipe.totalPax}</td>
</tr>
</table>


<div class="section-title">2. Rappel S\xE9curit\xE9</div>

<p>
${a.securite.remarques||"Les r\xE8gles de s\xE9curit\xE9 ont \xE9t\xE9 respect\xE9es durant l\u2019ensemble des interventions."}
</p>


<div class="section-title">3. Travaux R\xE9alis\xE9s</div>

<table>
<tr>
<th>T\xE2ches effectu\xE9es</th>
<th>Ex\xE9cutants</th>
<th>Statut</th>
</tr>

${a.travaux.map(f=>`
<tr>
<td>${f.tache}</td>
<td>${f.executeurs.join(", ")}</td>
<td class="center">${f.avancement}%</td>
</tr>
`).join("")}

</table>


<div class="section-title">7. Logistique & Mobilisation</div>

<table>
<tr>
<th>Mobilisation</th>
<td>${a.logistique.mobilisation||"-"}</td>
</tr>

<tr>
<th>D\xE9mobilisation</th>
<td>${a.logistique.demobilisation||"-"}</td>
</tr>

<tr>
<th>Personnel</th>
<td>${a.logistique.personnel.join(", ")}</td>
</tr>

<tr>
<th>Mat\xE9riel</th>
<td>${a.logistique.materiel.join(", ")}</td>
</tr>

</table>


<div class="section-title">8. Validation</div>

<table>
<tr>
<th>Nom</th>
<td>${a.validation.nom}</td>
</tr>

<tr>
<th>Fonction</th>
<td>${a.validation.fonction}</td>
</tr>

<tr>
<th>Signature</th>
<td>${a.validation.signe?"\u2713 Valid\xE9":"__________________"}</td>
</tr>
</table>

</main>

</body>
</html>
`;t.document.open(),t.document.write(d),t.document.close(),setTimeout(()=>{t.print()},500)}static \u0275fac=function(t){return new(t||l)(x(w),x(z),x(q),x(W),x(k),x(G),x(U))};static \u0275cmp=I({type:l,selectors:[["app-list-rapports"]],decls:79,vars:11,consts:[[1,"rapports-container"],[1,"page-header"],[1,"btn","btn-validation",3,"click"],[1,"stats-cards"],[1,"stat-card"],[1,"stat-icon","total"],[1,"stat-details"],[1,"stat-number"],[1,"stat-trend"],[1,"stat-icon","pax"],[1,"stat-icon","en-cours"],[1,"stat-icon","termine"],[1,"filters-section"],[1,"search-box"],["type","text","placeholder","\u{1F50D} Rechercher par superviseur, chef d'\xE9quipe...",1,"search-input",3,"ngModelChange","input","ngModel"],[1,"filter-group"],["type","date","placeholder","Filtrer par date",1,"filter-date",3,"ngModelChange","change","ngModel"],[1,"btn-reset",3,"click"],[1,"rapports-list"],["class","rapport-card",4,"ngFor","ngForOf"],["class","pagination",4,"ngIf"],[1,"modal",3,"click"],[1,"modal-content","modal-large"],[1,"modal-header"],[1,"close-btn",3,"click"],["class","modal-body",4,"ngIf"],[1,"modal-footer"],[1,"btn","btn-secondaire",3,"click"],[1,"rapport-card"],[1,"card-header"],[1,"project-info"],[1,"date"],[1,"rapport-actions"],["title","Voir les d\xE9tails du rapport",1,"action-btn","view",3,"click"],["title","Modifier le rapport",1,"action-btn","edit",3,"click"],[1,"card-body"],[1,"info-grid"],[1,"info-item"],[1,"avancement-value"],[1,"equipe-section"],[1,"equipe-list"],["class","pax-badge",4,"ngFor","ngForOf"],[1,"travaux-section"],[1,"travaux-list"],["class","travail-item",4,"ngFor","ngForOf"],[1,"logistique-section"],[1,"logistique-item"],[1,"validation-section"],[1,"validation-badge"],[1,"pax-badge"],[1,"travail-item"],[1,"travail-header"],[1,"travail-nom"],[1,"travail-avancement"],[1,"progress-bar"],[1,"progress-fill"],[1,"travail-executeurs"],[1,"label"],["class","executeur-badge",4,"ngFor","ngForOf"],[1,"executeur-badge"],[1,"pagination"],[3,"click","disabled"],[1,"modal-body"],[1,"detail-header"],[1,"detail-date"],[1,"detail-section"],[1,"detail-grid"],[1,"detail-table"],[4,"ngFor","ngForOf"],[1,"securite-box"],[1,"securite-status"],["class","travail-detail",4,"ngFor","ngForOf"],["class","detail-section",4,"ngIf"],[1,"detail-section","validation-footer"],[1,"validation-box"],[4,"ngIf"],[1,"travail-detail"],[1,"travail-title"],[1,"avancement-badge"],[1,"photos-grid"],["class","photo-item",4,"ngFor","ngForOf"],[1,"photo-item"]],template:function(t,o){t&1&&(n(0,"div",0)(1,"div",1)(2,"div")(3,"h1"),i(4,"\u{1F4CB} Rapports journaliers"),e(),n(5,"p"),i(6,"Suivi et gestion des rapports d'activit\xE9s par projet"),e()(),n(7,"button",2),g("click",function(){return o.addRapport()}),n(8,"span"),i(9,"\u2795"),e(),i(10," Nouveau rapport "),e()(),n(11,"div",3)(12,"div",4)(13,"div",5)(14,"span"),i(15,"\u{1F4C4}"),e()(),n(16,"div",6)(17,"h3"),i(18,"Total rapports"),e(),n(19,"div",7),i(20),e(),n(21,"span",8),i(22,"Rapports enregistr\xE9s"),e()()(),n(23,"div",4)(24,"div",9)(25,"span"),i(26,"\u{1F465}"),e()(),n(27,"div",6)(28,"h3"),i(29,"Total personnel"),e(),n(30,"div",7),i(31),e(),n(32,"span",8),i(33,"Intervenants comptabilis\xE9s"),e()()(),n(34,"div",4)(35,"div",10)(36,"span"),i(37,"\u{1F504}"),e()(),n(38,"div",6)(39,"h3"),i(40,"Travaux en cours"),e(),n(41,"div",7),i(42),e(),n(43,"span",8),i(44,"Rapports avec travaux actifs"),e()()(),n(45,"div",4)(46,"div",11)(47,"span"),i(48,"\u2705"),e()(),n(49,"div",6)(50,"h3"),i(51,"Travaux termin\xE9s"),e(),n(52,"div",7),i(53),e(),n(54,"span",8),i(55,"Rapports complets"),e()()()(),n(56,"div",12)(57,"div",13)(58,"input",14),R("ngModelChange",function(d){return D(o.searchTerm,d)||(o.searchTerm=d),d}),g("input",function(){return o.applyFilters()}),e()(),n(59,"div",15)(60,"input",16),R("ngModelChange",function(d){return D(o.selectedDate,d)||(o.selectedDate=d),d}),g("change",function(){return o.applyFilters()}),e(),n(61,"button",17),g("click",function(){return o.resetFilters()}),i(62,"R\xE9initialiser"),e()()(),n(63,"div",18),u(64,K,58,13,"div",19),e(),u(65,X,7,4,"div",20),n(66,"div",21),g("click",function(d){return o.closeModalOnOutside(d)}),n(67,"div",22)(68,"div",23)(69,"h3"),i(70,"\u{1F4C4} D\xE9tail du rapport"),e(),n(71,"button",24),g("click",function(){return o.closeDetailModal()}),i(72,"\xD7"),e()(),u(73,rt,73,18,"div",25),n(74,"div",26)(75,"button",27),g("click",function(){return o.closeDetailModal()}),i(76,"Fermer"),e(),n(77,"button",2),g("click",function(){return o.printRapport(o.selectedRapport)}),i(78,"Imprimer"),e()()()()()),t&2&&(r(20),c(o.stats.total),r(11),c(o.stats.totalPax),r(11),c(o.stats.travauxEnCours),r(11),c(o.stats.travauxTermines),r(5),S("ngModel",o.searchTerm),r(2),S("ngModel",o.selectedDate),r(4),m("ngForOf",o.filteredRapports),r(),m("ngIf",o.totalPages>1),r(),P("active",o.showDetailModal),r(7),m("ngIf",o.selectedRapport))},dependencies:[T,j,F,N,$,A,V,B],styles:[".rapports-container[_ngcontent-%COMP%]{padding:1.5rem;background:var(--gray-100);min-height:100vh}.page-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem}.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:1.8rem;color:var(--gray-800);margin-bottom:.25rem}.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--gray-600)}.stats-cards[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;margin-bottom:2rem}.stat-card[_ngcontent-%COMP%]{background:#fff;border-radius:var(--radius-lg);padding:1.25rem;display:flex;align-items:center;gap:1rem;box-shadow:var(--shadow);transition:var(--transition)}.stat-card[_ngcontent-%COMP%]:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg)}.stat-icon[_ngcontent-%COMP%]{width:55px;height:55px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.6rem}.stat-icon.total[_ngcontent-%COMP%]{background:#4361ee1a}.stat-icon.pax[_ngcontent-%COMP%]{background:#06d6a01a}.stat-icon.en-cours[_ngcontent-%COMP%]{background:#ffd1661a}.stat-icon.termine[_ngcontent-%COMP%]{background:#06d6a01a}.stat-details[_ngcontent-%COMP%]{flex:1}.stat-details[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:.85rem;color:var(--gray-600);margin-bottom:.25rem}.stat-number[_ngcontent-%COMP%]{font-size:1.8rem;font-weight:700;color:var(--gray-800);line-height:1}.stat-trend[_ngcontent-%COMP%]{font-size:.7rem;color:var(--gray-500)}.filters-section[_ngcontent-%COMP%]{background:#fff;border-radius:var(--radius-lg);padding:1rem;margin-bottom:2rem;box-shadow:var(--shadow)}.search-box[_ngcontent-%COMP%]{margin-bottom:1rem}.search-input[_ngcontent-%COMP%]{width:100%;padding:.75rem 1rem;border:2px solid var(--gray-200);border-radius:var(--radius);font-size:1rem}.filter-group[_ngcontent-%COMP%]{display:flex;gap:1rem;flex-wrap:wrap}.filter-select[_ngcontent-%COMP%], .filter-date[_ngcontent-%COMP%]{padding:.5rem 1rem;border:1px solid var(--gray-300);border-radius:var(--radius);background:#fff;font-family:inherit}.btn-reset[_ngcontent-%COMP%]{padding:.5rem 1rem;background:var(--gray-200);border:none;border-radius:var(--radius);cursor:pointer;transition:var(--transition)}.btn-reset[_ngcontent-%COMP%]:hover{background:var(--gray-300)}.rapports-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.5rem}.rapport-card[_ngcontent-%COMP%]{background:#fff;border-radius:var(--radius-lg);box-shadow:var(--shadow);overflow:hidden;transition:var(--transition)}.rapport-card[_ngcontent-%COMP%]:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}.card-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.5rem;background:linear-gradient(135deg,var(--primary-color),var(--info-color));color:#fff}.project-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0;font-size:1.2rem}.project-info[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%]{font-size:.8rem;opacity:.9}.rapport-actions[_ngcontent-%COMP%]{display:flex;gap:.5rem}.action-btn[_ngcontent-%COMP%]{border:none;border-radius:var(--radius);cursor:pointer;transition:var(--transition);font-family:inherit}.action-btn.view[_ngcontent-%COMP%], .action-btn.edit[_ngcontent-%COMP%]{background:#fff3;color:#fff}.action-btn[_ngcontent-%COMP%]:hover{background:#fff6;transform:scale(1.05)}.card-body[_ngcontent-%COMP%]{padding:1.5rem}.info-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--gray-200)}.info-item[_ngcontent-%COMP%]{display:flex;flex-direction:column}.info-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:.7rem;font-weight:600;color:var(--gray-500);text-transform:uppercase}.info-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:.9rem;font-weight:500;color:var(--gray-800)}.avancement-value[_ngcontent-%COMP%]{color:var(--primary-color);font-weight:700}.equipe-section[_ngcontent-%COMP%], .travaux-section[_ngcontent-%COMP%], .logistique-section[_ngcontent-%COMP%]{margin-bottom:1rem}.equipe-section[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], .travaux-section[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:var(--gray-600);margin-bottom:.5rem;display:block}.equipe-list[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.5rem}.pax-badge[_ngcontent-%COMP%]{background:var(--gray-100);padding:.25rem .75rem;border-radius:20px;font-size:.75rem;color:var(--gray-700)}.travaux-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1rem}.travail-item[_ngcontent-%COMP%]{background:var(--gray-50);padding:.75rem;border-radius:var(--radius)}.travail-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem}.travail-nom[_ngcontent-%COMP%]{font-weight:500;font-size:.9rem}.travail-avancement[_ngcontent-%COMP%]{padding:.2rem .5rem;border-radius:20px;font-size:.7rem;font-weight:700}.travail-avancement.complet[_ngcontent-%COMP%]{background:#06d6a033;color:#06d6a0}.travail-avancement.tres-avance[_ngcontent-%COMP%]{background:#4361ee33;color:#4361ee}.travail-avancement.mi-parcours[_ngcontent-%COMP%], .travail-avancement.commence[_ngcontent-%COMP%]{background:#ffd16633;color:#ffd166}.travail-avancement.debut[_ngcontent-%COMP%]{background:#ef476f33;color:#ef476f}.progress-bar[_ngcontent-%COMP%]{height:6px;background:var(--gray-200);border-radius:3px;overflow:hidden;margin:.5rem 0}.progress-fill[_ngcontent-%COMP%]{height:100%;background:var(--primary-color);border-radius:3px;transition:width .3s ease}.travail-executeurs[_ngcontent-%COMP%]{font-size:.7rem;color:var(--gray-500)}.travail-executeurs[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%]{font-weight:600;margin-right:.25rem}.executeur-badge[_ngcontent-%COMP%]{background:#fff;padding:.125rem .5rem;border-radius:12px;margin-right:.25rem;font-size:.7rem}.logistique-section[_ngcontent-%COMP%]{display:flex;gap:1rem;padding:.75rem;background:var(--gray-50);border-radius:var(--radius)}.logistique-item[_ngcontent-%COMP%]{flex:1}.logistique-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;font-size:.7rem;font-weight:600;color:var(--gray-500);margin-bottom:.25rem}.validation-section[_ngcontent-%COMP%]{margin-top:1rem;text-align:right}.validation-badge[_ngcontent-%COMP%]{display:inline-block;padding:.3rem .8rem;background:var(--gray-200);border-radius:20px;font-size:.75rem}.validation-badge.signe[_ngcontent-%COMP%]{background:#06d6a01a;color:#06d6a0}.pagination[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;gap:1rem;margin-top:2rem;padding:1rem}.pagination[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{padding:.5rem 1rem;border:1px solid var(--gray-300);background:#fff;border-radius:var(--radius);cursor:pointer;transition:var(--transition)}.pagination[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover:not(:disabled){background:var(--primary-color);color:#fff}.pagination[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{opacity:.5;cursor:not-allowed}.modal[_ngcontent-%COMP%]{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;z-index:1000;align-items:center;justify-content:center}.modal.active[_ngcontent-%COMP%]{display:flex}.modal-large[_ngcontent-%COMP%]{max-width:800px;width:90%;max-height:90vh;overflow-y:auto}.modal-content[_ngcontent-%COMP%]{background:#fff;border-radius:var(--radius-lg);overflow:hidden}.modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]{max-height:85vh;overflow-y:auto}.modal[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]{overflow-y:auto}.modal-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.5rem;background:var(--gray-100);border-bottom:1px solid var(--gray-200)}.close-btn[_ngcontent-%COMP%]{background:none;border:none;font-size:1.5rem;cursor:pointer}.modal-body[_ngcontent-%COMP%]{padding:1.5rem}.modal-footer[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;gap:1rem;padding:1rem 1.5rem;border-top:1px solid var(--gray-200)}.detail-header[_ngcontent-%COMP%]{text-align:center;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:2px solid var(--gray-200)}.detail-section[_ngcontent-%COMP%]{margin-bottom:1.5rem}.detail-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin-bottom:.75rem;color:var(--primary-color)}.detail-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.75rem;background:var(--gray-50);padding:1rem;border-radius:var(--radius)}.detail-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse}.detail-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .detail-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:.5rem;text-align:left;border-bottom:1px solid var(--gray-200)}.detail-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{background:var(--gray-100);font-weight:600}.securite-box[_ngcontent-%COMP%]{background:#06d6a00d;padding:1rem;border-radius:var(--radius);border-left:3px solid var(--success-color)}.securite-status.respectee[_ngcontent-%COMP%]{color:#06d6a0;font-weight:700}.travail-detail[_ngcontent-%COMP%]{background:var(--gray-50);padding:1rem;border-radius:var(--radius);margin-bottom:1rem}.travail-title[_ngcontent-%COMP%]{display:flex;justify-content:space-between;margin-bottom:.5rem}.avancement-badge[_ngcontent-%COMP%]{padding:.2rem .5rem;border-radius:20px;font-size:.7rem;font-weight:700}.photos-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem}.photo-item[_ngcontent-%COMP%]{text-align:center}.photo-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100px;object-fit:cover;border-radius:var(--radius)}.photo-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:.7rem;margin-top:.25rem}.validation-footer[_ngcontent-%COMP%]{margin-top:1rem;padding-top:1rem;border-top:1px solid var(--gray-200)}.validation-box[_ngcontent-%COMP%]{text-align:center;padding:.75rem;background:#06d6a00d;border-radius:var(--radius)}@media(max-width:768px){.rapports-container[_ngcontent-%COMP%]{padding:1rem}.filter-group[_ngcontent-%COMP%]{flex-direction:column}.filter-select[_ngcontent-%COMP%], .filter-date[_ngcontent-%COMP%], .btn-reset[_ngcontent-%COMP%]{width:100%}.card-header[_ngcontent-%COMP%]{flex-direction:column;gap:.5rem;text-align:center}.info-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}.logistique-section[_ngcontent-%COMP%]{flex-direction:column}.travail-header[_ngcontent-%COMP%]{flex-direction:column;gap:.25rem}.photos-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}"]})};export{J as ListRapports};
