import { Component, OnInit } from '@angular/core';
import { IModule } from './IModule';
import { StatusService } from './status.service';

@Component({
  selector: 'bcs-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit{
  selectedModule: IModule | undefined;
  selectedDetailType: string = 'health';
  display = false;
  bcsModules: IModule[] = [];
  data: string = '';
  
  ngOnInit(): void {
    this.statusApi.getModules().subscribe({
      next : result => {
        this.bcsModules = result;
        this.bcsModules.forEach(element => {
          this.retrieveStatus(element)  
        });
      }
    })
  }

  constructor(private statusApi: StatusService){}

  retrieveStatus(module :IModule) {
    if (module) {
      this.callMonitoringApi(module, "health");
    }
  }
  
  callMonitoringApi(module: IModule, type: string) {
    let fullUrl = module.url + '/' + type;
    console.log('calling ' + fullUrl);
    this.statusApi.getDetails(fullUrl).subscribe({
      next: data => this.extractData(data, module),
      error: err => {
        this.extractData(err.message, module);
      }
    });
  }
  extractData(data: any, module: IModule): void {
    if (this.selectedDetailType == 'health') {
      this.extractStatus(data, module);
    }
    if (this.selectedModule) {
      this.data = data;
    }
  }
  extractStatus(body: any, module :IModule) {
    module.status = body.status;
    if (module.status == 'UP') {
      module.health = 'success';
    } else if (module.status == 'DEGRADED'){
      module.health = 'warning';
    } else {
      module.status = 'DOWN';
      module.health = 'danger';
    }
  }

  selectModule(module: IModule) {
    this.data = 'loading ...';
    this.selectedModule = module;
    this.display = true;
    this.selectDetailType("health");
  }

  selectDetailType(type: string) {
    this.data = 'loading ...';
    this.selectedDetailType = type;
    this.loadDetails();
  }
  loadDetails() {
    if (this.selectedModule) {
      this.callMonitoringApi(this.selectedModule, this.selectedDetailType);
    }
  }  
}


