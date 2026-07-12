import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Room, RoomService } from '../../core/services/room.service';
import {
  Booking,
  BookingService,
  CheckInRequest
} from '../../core/services/booking.service';

@Component({
  selector: 'app-checkinout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkinout.component.html',
  styleUrl: './checkinout.component.css'
})
export class CheckinoutComponent implements OnInit {

  availableRooms: Room[] = [];
  activeBookings: Booking[] = [];

  error = '';
  success = '';
  isCheckingIn = false;

  // Store today's date to restrict past date selections in HTML
  todayDate: string;

  checkInForm: CheckInRequest & { checkInDate?: string; checkOutDate?: string } = {
    roomId: 0,
    guestFullName: '',
    guestEmail: '',
    guestPhone: '',
    idProofType: 'PASSPORT',
    idProofNumber: '',
    address: '',
    numberOfGuests: 1,
    checkInDate: '',
    checkOutDate: ''
  };

  constructor(
    private roomService: RoomService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {
    this.todayDate = this.getTodayDate();
    this.checkInForm.checkInDate = this.todayDate;
  }

  ngOnInit(): void {
    this.loadAvailableRooms();
    this.loadActiveBookings();
  }

  // Helper to get YYYY-MM-DD for date inputs
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadAvailableRooms(): void {
    this.roomService.getAll('AVAILABLE').subscribe({
      next: (data) => {
        this.availableRooms = [...data];
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load available rooms. Please try again.';
      }
    });
  }

  loadActiveBookings(): void {
    this.bookingService.getActive().subscribe({
      next: (data) => {
        this.activeBookings = [...data];
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load active bookings.';
      }
    });
  }

  submitCheckIn(): void {
    this.error = '';
    this.success = '';

    if (!this.checkInForm.roomId) {
      this.error = 'Please select a room before checking in.';
      return;
    }
    
    if (!this.checkInForm.guestFullName || !this.checkInForm.guestPhone) {
      this.error = 'Guest name and phone number are required.';
      return;
    }

    if (!this.checkInForm.idProofNumber) {
      this.error = 'ID Proof Number is mandatory for check-in.';
      return;
    }

    if (!this.checkInForm.checkInDate || !this.checkInForm.checkOutDate) {
      this.error = 'Both Check-In and Check-Out dates are required.';
      return;
    }

    // NEW LOGIC: Prevent past dates in case the user bypassed HTML restrictions
    if (this.checkInForm.checkInDate < this.todayDate) {
      this.error = 'Check-In date cannot be in the past.';
      return;
    }

    if (this.checkInForm.checkOutDate <= this.checkInForm.checkInDate) {
      this.error = 'Check-Out date must be at least one day after the Check-In date.';
      return;
    }

    this.isCheckingIn = true;

    this.bookingService.checkIn(this.checkInForm).subscribe({
      next: (booking) => {
        this.success = `Success: ${booking.guestName} has been checked into Room ${booking.roomNumber}.`;
        this.resetForm();
        this.isCheckingIn = false;

        setTimeout(() => {
          this.loadAvailableRooms();
          this.loadActiveBookings();
        }, 300);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Check-in failed. Please verify details.';
        this.isCheckingIn = false;
      }
    });
  }

  submitCheckOut(booking: Booking): void {
    this.error = '';
    this.success = '';

    if (!confirm(`Are you sure you want to check out ${booking.guestName} from Room ${booking.roomNumber}?`)) {
      return;
    }

    this.bookingService.checkOut(booking.id).subscribe({
      next: (res) => {
        this.success = `Room ${res.roomNumber} successfully checked out.`;

        setTimeout(() => {
          this.loadAvailableRooms();
          this.loadActiveBookings();
        }, 300);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Check-out failed. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.checkInForm = {
      roomId: 0,
      guestFullName: '',
      guestEmail: '',
      guestPhone: '',
      idProofType: 'PASSPORT',
      idProofNumber: '',
      address: '',
      numberOfGuests: 1,
      checkInDate: this.todayDate,
      checkOutDate: ''
    };
  }
}