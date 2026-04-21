import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Destination } from '../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private readonly API = 'http://localhost:8080/api/destinations';
  private readonly adminApi = 'http://localhost:8080/api/admin/destinations';
  private readonly publicHeaders = new HttpHeaders({ Authorization: '' });

  constructor(private http: HttpClient) {}

  getAll(): Observable<Destination[]> {
    return this.http
      .get<Destination[]>(this.API, { headers: this.publicHeaders })
      .pipe(
        timeout(5000),
        catchError(() => this.http.get<Destination[]>(this.adminApi))
      );
  }

  getById(id: number): Observable<Destination> {
    return this.http
      .get<Destination>(`${this.API}/${id}`, { headers: this.publicHeaders })
      .pipe(
        timeout(5000),
        catchError(() => this.http.get<Destination>(`${this.adminApi}/${id}`))
      );
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
