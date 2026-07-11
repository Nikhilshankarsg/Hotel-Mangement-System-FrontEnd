import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
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

  form: RoomRequest = { roomNumber: '', roomType: 'SINGLE', floorNumber: 1, pricePerNight: 0 };
  editingId: number | null = null;

  constructor(private roomService: RoomService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  // loadRooms() {

  //     console.log("Calling getAll rooms API");
  //   this.roomService.getAll().subscribe({
  //     next: (data) => this.rooms = data,
  //     error: () => this.error = 'Failed to load rooms'
  //   });
  // }

  loadRooms() {
  console.log('Before API:', this.rooms.length);

  this.roomService.getAll().subscribe({
    next: (data) => {
      console.log('Received:', data);

      this.rooms = [...data];

      // Force Angular to update the template
      this.cdr.detectChanges();

      console.log('After assignment:', this.rooms.length);
    },
    error: (err) => {
      console.error(err);
      this.error = 'Failed to load rooms';
    }
  });
}

  openAddForm() {
    this.editingId = null;
    this.form = { roomNumber: '', roomType: 'SINGLE', floorNumber: 1, pricePerNight: 0 };
    this.showForm = true;
  }

  // openAddForm() {
  // console.log('Before click:', this.rooms.length);

  // this.editingId = null;
  // this.form = {
  //   roomNumber: '',
  //   roomType: 'SINGLE',
  //   floorNumber: 1,
  //   pricePerNight: 0
  // };

//   this.showForm = true;

//   console.log('After click:', this.rooms.length);
// }

  openEditForm(room: Room) {
    this.editingId = room.id;
    this.form = {
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      floorNumber: room.floorNumber,
      pricePerNight: room.pricePerNight
    };
    this.showForm = true;
  }

  saveRoom() {
    this.error = '';
    const action = this.editingId
      ? this.roomService.update(this.editingId, this.form)
      : this.roomService.create(this.form);

    action.subscribe({
      next: () => {
        this.showForm = false;
        this.loadRooms();
      },
      error: (err) => this.error = err?.error?.message || 'Failed to save room'
    });
  }

  toggleMaintenance(room: Room) {
    const underMaintenance = room.status !== 'MAINTENANCE';
    this.roomService.setMaintenance(room.id, underMaintenance).subscribe({
      next: () => this.loadRooms(),
      error: (err) => this.error = err?.error?.message || 'Failed to update room status'
    });
  }

  deleteRoom(room: Room) {
    if (!confirm(`Delete room ${room.roomNumber}?`)) return;
    this.roomService.delete(room.id).subscribe({
      next: () => this.loadRooms(),
      error: (err) => this.error = err?.error?.message || 'Failed to delete room'
    });
  }

  badgeClass(status: string): string {
    if (status === 'AVAILABLE') return 'badge badge-available';
    if (status === 'OCCUPIED') return 'badge badge-occupied';
    return 'badge badge-maintenance';
  }
}
