import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination } from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private readonly apiBaseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Destination[]> {
    return this.http.get<Destination[]>(
      `${this.apiBaseUrl}/api/admin/destinations`
    );
  }

  getById(id: number): Observable<Destination> {
    return this.http.get<Destination>(
      `${this.apiBaseUrl}/api/admin/destinations/${id}`
    );
  }

  create(destination: Partial<Destination>, file?: File | null): Observable<{ id: number; message: string }> {
    if (!file) {
      return this.http.post<{ id: number; message: string }>(
        `${this.apiBaseUrl}/api/admin/destinations`,
        destination
      );
    }

    const formData = new FormData();
    formData.append('destination', JSON.stringify(destination));
    formData.append('file', file);

    return this.http.post<{ id: number; message: string }>(
      `${this.apiBaseUrl}/api/admin/destinations`,
      formData
    );
  }

  update(id: number, destination: Partial<Destination>, file?: File | null): Observable<{ id: number; message: string }> {
    if (!file) {
      return this.http.put<{ id: number; message: string }>(
        `${this.apiBaseUrl}/api/admin/destinations/${id}`,
        destination
      );
    }

    const formData = new FormData();
    formData.append('destination', JSON.stringify(destination));
    formData.append('file', file);

    return this.http.put<{ id: number; message: string }>(
      `${this.apiBaseUrl}/api/admin/destinations/${id}`,
      formData
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiBaseUrl}/api/admin/destinations/${id}`
    );
  }
}