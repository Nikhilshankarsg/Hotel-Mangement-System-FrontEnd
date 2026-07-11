import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Room, RoomRequest, RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {

  rooms: Room[] = [];
  showForm = false;
  error = '';

  form: RoomRequest = {
    roomNumber: '',
    roomType: 'SINGLE',
    floorNumber: 1,
    pricePerNight: 0
  };

  editingId: number | null = null;

  constructor(
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    console.log('Before API:', this.rooms.length);

    this.roomService.getAll().subscribe({
      next: (data) => {
        console.log('Received:', data);

        this.rooms = [...data];
        this.cdr.detectChanges();

        console.log('After assignment:', this.rooms.length);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load rooms';
      }
    });
  }

  openAddForm(): void {
    this.editingId = null;

    this.form = {
      roomNumber: '',
      roomType: 'SINGLE',
      floorNumber: 1,
      pricePerNight: 0
    };

    this.showForm = true;
    console.log('Add Form Opened:', this.showForm);
  }

  openEditForm(room: Room): void {
  console.log('Edit button clicked');
  console.log(room);

  this.editingId = room.id;

  this.form = {
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    floorNumber: room.floorNumber,
    pricePerNight: room.pricePerNight
  };

  this.showForm = true;

  console.log('showForm after setting:', this.showForm);
}

  closeModal(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showForm = false;
    }
  }

  saveRoom(): void {
  console.log('Save button clicked');

  this.error = '';

  const action = this.editingId
    ? this.roomService.update(this.editingId, this.form)
    : this.roomService.create(this.form);

  action.subscribe({
    next: (res) => {
      console.log('API Success', res);
      this.showForm = false;
      this.loadRooms();
    },
    error: (err) => {
      console.error('API Error', err);
      this.error = err?.error?.message || 'Failed to save room';
    }
  });
}

 toggleMaintenance(room: Room): void {
  const underMaintenance = room.status !== 'MAINTENANCE';

  console.log('Before:', room.status);

  this.roomService.setMaintenance(room.id, underMaintenance).subscribe({
    next: () => {
      // Update UI immediately
      room.status = underMaintenance
        ? 'MAINTENANCE'
        : 'AVAILABLE';

      // Trigger change detection
      this.rooms = [...this.rooms];
      this.cdr.detectChanges();

      console.log('After:', room.status);
    },
    error: (err) => {
      console.error(err);
      this.error =
        err?.error?.message || 'Failed to update room status';
    }
  });
}

  deleteRoom(room: Room): void {
    if (!confirm(`Delete room ${room.roomNumber}?`)) {
      return;
    }

    this.roomService.delete(room.id).subscribe({
      next: () => this.loadRooms(),
      error: (err) => {
        this.error =
          err?.error?.message || 'Failed to delete room';
      }
    });
  }

  badgeClass(status: string): string {
    if (status === 'AVAILABLE') {
      return 'badge badge-available';
    }

    if (status === 'OCCUPIED') {
      return 'badge badge-occupied';
    }

    return 'badge badge-maintenance';
  }
}