import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.css']
})
export class ViewTableComponent implements OnInit {
  action;
  domain;
  columnNames;
  subColumnNames; 
  subTable;
  tableData;
  nestedTable = false;
  displayFormDialog = false;
  splitButtonItems: MenuItem[];


  constructor(private activatedroute:ActivatedRoute, private datas: DataService) {     
  }

  ngOnInit() {
    this.domain = this.activatedroute.snapshot.url[0].path;
    this.datas.getObjects(this.domain).subscribe(result =>{
      console.log(result);
      this.tableData = result;
      console.log(this.tableData);
      this.tableData.forEach((val,idx,arr) => {
        let dateProperty = Object.keys(val).filter(
          property => {
            return property.indexOf("date") === 0;
          }
        );
        // dateProperty.forEach(dp => {
        //   arr[idx][dp] = new Date( arr[idx][dp] ).toISOString().slice(0,10);
        // })  
      });
    })
    this.activatedroute.data.subscribe(data => {
      this.columnNames=data.cols;
      this.subColumnNames=data.subCols;
      this.subTable=data.subTable;
      console.log(data.nestedTable);
      this.nestedTable=data.nestedTable;
    })
    
    this.splitButtonItems = [
      {label: 'Garden.org', icon: 'pi pi-info', url: 'https://garden.org/'},
      // {separator: true},
      //{label: 'Setup', icon: 'pi pi-cog', routerLink: ['/setup']}
  ];

  }

  create() {
    this.displayFormDialog = true;
    this.action = "new";
  }

  edit() {
    this.displayFormDialog = true;
    this.action = "edit";
  }

  onDisplayChange(disp) {
    this.displayFormDialog = disp;
  }
}
