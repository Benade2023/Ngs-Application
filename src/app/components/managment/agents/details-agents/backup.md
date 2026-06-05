    <div class="detail-card" [class.expired-card]="isInductionExpired(employe)">
      <div class="card-header">
        <h3>📋 Induction</h3>
        <span class="status-badge" [class]="getInductionClass()">
          {{ getInductionStatus(employe) }}
        </span>
      </div>
      <div class="card-body">
        <div class="info-row" *ngIf="employe.induction?.dateEmission">
          <div class="info-label">Date d'émission</div>
          <div class="info-value">{{ employe.induction?.dateEmission | date:'dd/MM/yyyy' }}</div>
        </div>
        <div class="info-row" *ngIf="employe.induction?.dateExpiration">
          <div class="info-label">Date d'expiration</div>
          <div class="info-value">
            {{ employe.induction?.dateExpiration | date:'dd/MM/yyyy' }}
            <span class="expiration-warning" *ngIf="isInductionExpired(employe)">
              ⚠️ EXPIRÉ
            </span>
            <span class="expiration-warning" *ngIf="isInductionNearExpiration() && !isInductionExpired(employe)">
              ⚠️ Expire bientôt ({{ getDaysBeforeExpiration(employe.induction?.dateExpiration) }} jours)
            </span>
          </div>
        </div>
        <div class="info-row" *ngIf="employe.induction?.document">
          <div class="info-label">Document</div>
          <div class="info-value">
            <!-- <input type="file" (change)="onFileSelected($event)" accept=".png,.jpg,.jpeg,.pdf" />
            <button (click)="upload()">Téléversé le document</button> -->
            <div class="upload-container" *ngIf="!inductionAgent">

              <input #fileInput type="file" id="fileUpload" (change)="onFileSelected($event)"
                accept=".png,.jpg,.jpeg,.pdf" />

              <label for="fileUpload" class="file-label">
                Choisir un document
              </label>



              <!-- Bouton affiché seulement si un fichier est sélectionné -->
              <button class="upload-btn" *ngIf="selectedFile" (click)="uploadInduction()">
                Téléverser le document
              </button>

            </div>
            <!-- Nom du fichier -->
            <span class="file-name" *ngIf="selectedFile">
              {{'Fichier sélectionné: ' + selectedFile.name }}
            </span>
          </div>

          <div>
            <div class="file-link" *ngIf="inductionAgent">

              <!-- Voir document -->
              <a class="view-btn" [href]="apiUrl + inductionAgent.filePath" target="_blank">
                Voir le document
              </a>
              <div *ngIf="getInductionStatus(employe) === 'Expire bientôt' || getInductionStatus(employe) === 'Expiré'">
   <!-- Input caché -->
              <input #fileInput type="file" id="fileUpload" hidden (change)="onFileSelected($event)"
                accept=".png,.jpg,.jpeg,.pdf" />

              <!-- Bouton choisir fichier -->
              <label for="fileUpload" class="upload-btn">
                Mise à jour du document
              </label>
              <!-- Bouton modifier visible seulement si fichier choisi -->
              <button class="update-btn" type="button" *ngIf="selectedFile" (click)="updateFile(inductionAgent.id)">
                Modifier
              </button>
              </div>
            </div>
          </div>
        </div>
        <div class="info-row" *ngIf="!employe.induction">
          <div class="info-value">Aucune induction enregistrée</div>
        </div>
      </div>
    </div>