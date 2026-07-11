import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
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

  checkInForm: CheckInRequest = {
    roomId: 0,
    guestFullName: '',
    guestEmail: '',
    guestPhone: '',
    idProofType: 'PASSPORT',
    idProofNumber: '',
    address: '',
    numberOfGuests: 1
  };

  constructor(
    private roomService: RoomService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAvailableRooms();
    this.loadActiveBookings();
  }

  loadAvailableRooms(): void {
  this.roomService.getAll('AVAILABLE').subscribe({
    next: (data) => {
      this.availableRooms = [...data];
      this.cdr.detectChanges();
    },
    error: () => {
      this.error = 'Failed to load available rooms';
    }
  });
}

 loadActiveBookings(): void {
  this.bookingService.getActive().subscribe({
    next: (data) => {
      console.log('Active bookings:', data);

      this.activeBookings = [...data];

      this.cdr.detectChanges();
    },
    error: () => {
      this.error = 'Failed to load active bookings';
    }
  });
}

  submitCheckIn(): void {
  this.error = '';
  this.success = '';

  if (!this.checkInForm.roomId) {
    this.error = 'Please select a room';
    return;
  }

  this.bookingService.checkIn(this.checkInForm).subscribe({
    next: (booking) => {
      this.success =
        `Guest ${booking.guestName} checked into room ${booking.roomNumber}`;

      this.resetForm();

      setTimeout(() => {
        this.loadAvailableRooms();
        this.loadActiveBookings();
      }, 300);
    },
    error: (err) => {
      this.error =
        err?.error?.message || 'Check-in failed';
    }
  });
}

submitCheckOut(booking: Booking): void {
  this.error = '';
  this.success = '';

  if (!confirm(
    `Check out ${booking.guestName} from room ${booking.roomNumber}?`
  )) {
    return;
  }

  this.bookingService.checkOut(booking.id).subscribe({
    next: (res) => {
      this.success =
        `Room ${res.roomNumber} checked out. Total amount: ₹${res.totalAmount}`;

      setTimeout(() => {
        this.loadAvailableRooms();
        this.loadActiveBookings();
      }, 300);
    },
    error: (err) => {
      this.error =
        err?.error?.message || 'Check-out failed';
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
      numberOfGuests: 1
    };
  }
}