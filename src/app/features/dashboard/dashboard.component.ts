import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import Chart from 'chart.js/auto';

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
  private chart: Chart | any;

  constructor(
    private dashboardService: DashboardService, 
    private cdr: ChangeDetectorRef
  ) {}

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
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadStats(): void {
    // Only show loading text on initial load to prevent flickering during intervals
    if (!this.stats) {
      this.loading = true;
    }

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.error = '';
        this.loading = false;
        
        // Ensure DOM updates before drawing/updating the chart
        this.cdr.detectChanges();
        this.updateChart();
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.error = 'Could not load dashboard stats';
        this.loading = false;
        
        this.cdr.detectChanges();
      }
    });
  }

  private updateChart(): void {
    if (!this.stats) return;

    // We only want to plot the distribution of actual rooms
    const chartData = [
      this.stats.availableRooms, 
      this.stats.occupiedRooms, 
      this.stats.maintenanceRooms
    ];

    if (this.chart) {
      // Update existing chart seamlessly without re-rendering the whole canvas
      this.chart.data.datasets[0].data = chartData;
      this.chart.update();
    } else {
      // Create chart for the first time
      this.createChart(chartData);
    }
  }

  private createChart(data: number[]): void {
    const canvas = document.getElementById('roomStatsChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Available', 'Occupied', 'Maintenance'],
        datasets: [{
          data: data,
          backgroundColor: [
            '#22c55e', // Green to match Available Card
            '#ef4444', // Red to match Occupied Card
            '#f59e0b'  // Orange to match Maintenance Card
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                family: 'inherit',
                size: 13
              }
            }
          },
          tooltip: {
            padding: 12,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw} Rooms`
            }
          }
        }
      }
    });
  }
}