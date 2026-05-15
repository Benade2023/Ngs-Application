import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadedFile } from '../interfaces/uploadFile.interface';
import { EnvironmentProduction } from '../../../environment/environment.production';



@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = EnvironmentProduction.apiUrlExtern;

  constructor(private http: HttpClient) {}

uploadFile(
  file: File,
  matricule?: string,
  projectId?: string,
  type?: string
): Observable<UploadedFile> {
  const formData = new FormData();
  formData.append('file', file);

  const matriculeValue = (matricule ?? '').trim();
  if (matriculeValue) {
    formData.append('matriculeAgent', matriculeValue);
  }

  const typeFichier = (type ?? '').trim();
  if (type) {
    formData.append('type', typeFichier);
  }

  const projectIdValue = (projectId ?? '').trim();
  if (projectIdValue) {
    formData.append('projectId', projectIdValue);
  }

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return this.http.post<UploadedFile>(`${this.apiUrl}/upload`, formData);
}

  getFiles(): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(`${this.apiUrl}/files`);
  }

   updateFile(
    id: number,
    file: File,
    matricule?: string,
    projectId?: string,
    type?: string
  ): Observable<UploadedFile> {

    const formData = new FormData();
  formData.append('file', file);

  const matriculeValue = (matricule ?? '').trim();
  if (matriculeValue) {
    formData.append('matriculeAgent', matriculeValue);
  }

  const typeFichier = (type ?? '').trim();
  if (type) {
    formData.append('type', typeFichier);
  }

  const projectIdValue = (projectId ?? '').trim();
  if (projectIdValue) {
    formData.append('projectId', projectIdValue);
  }

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }


   return this.http.patch<UploadedFile>(
  `${this.apiUrl}/files/${id}`,
  formData
);
  }
}