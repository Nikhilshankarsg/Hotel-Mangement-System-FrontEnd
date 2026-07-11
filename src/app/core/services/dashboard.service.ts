import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentBaseUrl } from '../../app.environment';

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  totalGuestsCheckedIn: number;
  occupancyRatePercent: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = `${environmentBaseUrl}/api/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }
}
