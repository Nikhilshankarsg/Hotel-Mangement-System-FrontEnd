import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentBaseUrl } from '../../app.environment';

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  floorNumber: number;
  pricePerNight: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface RoomRequest {
  roomNumber: string;
  roomType: string;
  floorNumber: number;
  pricePerNight: number;
}

@Injectable({ providedIn: 'root' })
export class RoomService {
  private baseUrl = `${environmentBaseUrl}/api/admin/rooms`;

  constructor(private http: HttpClient) {}

  getAll(status?: string): Observable<Room[]> {
    const url = status ? `${this.baseUrl}?status=${status}` : this.baseUrl;
    return this.http.get<Room[]>(url);
  }

  create(request: RoomRequest): Observable<Room> {
    return this.http.post<Room>(this.baseUrl, request);
  }

  update(id: number, request: RoomRequest): Observable<Room> {
    return this.http.put<Room>(`${this.baseUrl}/${id}`, request);
  }

  setMaintenance(id: number, underMaintenance: boolean): Observable<Room> {
    return this.http.patch<Room>(`${this.baseUrl}/${id}/maintenance?underMaintenance=${underMaintenance}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
