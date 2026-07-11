
import { Component, OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';
  private refreshInterval: any;

  constructor(private dashboardService: DashboardService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStats();

    // Auto refresh every 15 seconds
    this.refreshInterval = setInterval(() => {
      this.loadStats();
    }, 15000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

 loadStats(): void {
  this.loading = true;

  this.dashboardService.getStats().subscribe({
    next: (data) => {
      console.log('Dashboard Data:', data);

      this.stats = data;
      this.error = '';
      this.loading = false;

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Dashboard Error:', err);

      this.error = 'Could not load dashboard stats';
      this.loading = false;

      this.cdr.detectChanges();
    }
  });
}
}

