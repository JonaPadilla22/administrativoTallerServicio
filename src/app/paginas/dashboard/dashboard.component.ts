import { Component, OnInit } from '@angular/core';
import { ServicioService } from 'src/app/servicios/servicios/servicio.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard: any = [];
  constructor(private servService: ServicioService) { }

  async ngOnInit() {
    this.dashboard = await this.servService.getDashboard().toPromise();
    console.log(this.dashboard)
  }

}
