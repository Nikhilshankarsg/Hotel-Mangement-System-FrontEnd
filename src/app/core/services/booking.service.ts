import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentBaseUrl } from '../../app.environment';

export interface CheckInRequest {
  roomId: number;
  guestFullName: string;
  guestEmail?: string;
  guestPhone: string;
  idProofType?: string;
  idProofNumber?: string;
  address?: string;
  numberOfGuests: number;
  expectedCheckOut?: string;
}

export interface Booking {
  id: number;
  roomNumber: string;
  guestName: string;
  guestPhone: string;
  checkInTime: string;
  checkOutTime: string | null;
  expectedCheckOut: string | null;
  numberOfGuests: number;
  totalAmount: number;
  status: 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = `${environmentBaseUrl}/api/admin/bookings`;

  constructor(private http: HttpClient) {}

  checkIn(request: CheckInRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/check-in`, request);
  }

  checkOut(bookingId: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/check-out`, { bookingId });
  }

  getActive(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/active`);
  }

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl);
  }
}
