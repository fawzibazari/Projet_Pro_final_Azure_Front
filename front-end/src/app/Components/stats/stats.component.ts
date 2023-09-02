import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ImagesListService } from 'src/app/Services/images-list.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  constructor(public imagesListService: ImagesListService) {}
  imagesList: any[] = [];

  ngOnInit(): void {
    this.createChart();
  }
  public chart: any;

  createChart() {
    this.imagesListService.getImagesStats().subscribe((data) => {
      this.imagesList = data.stats;
      const dates: any[] = [];
      const counts: any[] = [];

      this.imagesList.forEach((stat) => {
        dates.push(stat.date);
        counts.push(stat.count);
      });

      this.chart = new Chart('MyChart', {
        type: 'line', //this denotes tha type of chart

        data: {
          // values on X-Axis
          labels: dates.reverse(),
          datasets: [
            {
              label: 'Images',
              data: counts,
              backgroundColor: 'blue',
              pointStyle: 'circle',
              pointRadius: 10,
              pointHoverRadius: 15,
            },
          ],
        },
        options: {
          aspectRatio: 2.5,
          responsive: true,
          scales: {
            y: {
              min: 0,
              ticks: {
                stepSize: 1 
            }
            },
          },
        },
      });
    });
  }
}
