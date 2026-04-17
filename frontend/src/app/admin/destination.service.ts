import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination } from '../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private readonly API = 'http://localhost:8080/api/admin/destinations';  // Update if backend port differs

  constructor(private http: HttpClient) {}

  getAll(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.API);
  }

  getById(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.API}/${id}`);
  }

  create(destination: Destination): Observable<any> {
    return this.http.post(this.API, destination);
  }

  update(id: number, destination: Destination): Observable<any> {
    return this.http.put(`${this.API}/${id}`, destination);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
