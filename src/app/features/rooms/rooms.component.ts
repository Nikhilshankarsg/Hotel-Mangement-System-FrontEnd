import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Room, RoomRequest, RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Room[] = [];
  showForm = false;
  error = '';
  roomNumberError = '';
  editingId: number | null = null;

  // --- Pagination Variables (Stable Arrays) ---
  currentPage = 1;
  pageSize = 5; 
  totalPages = 1;
  startIndex = 0;
  endIndex = 0;
  
  paginatedRooms: Room[] = [];
  pageNumbers: number[] = [1];

  form: RoomRequest = {
    roomNumber: '',
    roomType: 'SINGLE',
    floorNumber: 1,
    pricePerNight: 0
  };

  constructor(
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  // --- Core Pagination Logic ---
  updatePagination(): void {
    this.totalPages = Math.ceil(this.rooms.length / this.pageSize) || 1;
    
    // Prevent being stranded on an empty page
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.rooms.length);
    
    // Assign stable arrays to avoid change detection bugs
    this.paginatedRooms = this.rooms.slice(this.startIndex, this.endIndex);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    this.cdr.detectChanges();
  }

  // --- Pagination Controls ---
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // --- API & Form Logic ---
  loadRooms(): void {
    this.roomService.getAll().subscribe({
      next: (data) => {
        this.rooms = [...data];
        this.updatePagination(); // Triggers the slice and calculates pages
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load rooms';
      }
    });
  }

  openAddForm(): void {
    this.editingId = null;
    this.roomNumberError = '';
    this.form = {
      roomNumber: '',
      roomType: 'SINGLE',
      floorNumber: 1,
      pricePerNight: 0
    };
    this.showForm = true;
  }

  openEditForm(room: Room): void {
    this.editingId = room.id;
    this.roomNumberError = '';
    this.form = {
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      floorNumber: room.floorNumber,
      pricePerNight: room.pricePerNight
    };
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.roomNumberError = '';
    this.form = {
      roomNumber: '',
      roomType: 'SINGLE',
      floorNumber: 1,
      pricePerNight: 0
    };
    this.cdr.detectChanges();
  }

  checkRoomNumber(): void {
    this.roomNumberError = '';
    if (!this.form.roomNumber) return;

    const exists = this.rooms.some(room =>
      room.roomNumber.toLowerCase() === this.form.roomNumber.toLowerCase() &&
      room.id !== this.editingId
    );

    if (exists) {
      this.roomNumberError = `Room number already exists: ${this.form.roomNumber}`;
    }
  }

  saveRoom(): void {
    this.error = '';
    this.checkRoomNumber();

    if (this.roomNumberError || !this.form.roomNumber) return;

    const request = this.editingId
      ? this.roomService.update(this.editingId, this.form)
      : this.roomService.create(this.form);

    request.subscribe({
      next: () => {
        this.showForm = false;
        this.loadRooms(); 
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Failed to save room';
      }
    });
  }

  toggleMaintenance(room: Room): void {
    const maintenance = room.status !== 'MAINTENANCE';

    this.roomService.setMaintenance(room.id, maintenance).subscribe({
      next: () => {
        room.status = maintenance ? 'MAINTENANCE' : 'AVAILABLE';
        this.updatePagination(); // Updates the UI instantly
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Failed to update status';
      }
    });
  }

  badgeClass(status: string): string {
    if (status === 'AVAILABLE') return 'badge badge-available';
    if (status === 'OCCUPIED') return 'badge badge-occupied';
    return 'badge badge-maintenance';
  }
}