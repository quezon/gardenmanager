import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-prime-ng-tree-table',
  templateUrl: './prime-ng-tree-table.component.html',
  styleUrls: ['./prime-ng-tree-table.component.css']
})
export class PrimeNgTreeTableComponent implements OnInit {
  @Input('objects') objects: any[]; 
  @Input('cols') cols: any[];
  @Input('subCols') subCols: any[];
  @Input('subTable') subTable: any[];
  @Input() domain;
  
  subTableKey: any[];
  displayPhoto: boolean;
  displayEditForm: boolean;
  items: MenuItem[];
  photoSrc;
  toEdit;

  constructor() { 
    //this.subTableKey = Object.keys(this.subCols);
    //console.log(this.objects['plantingMaterialsUsed']);
  }

  ngOnInit() {
    this.items = [
      {label: 'Chemical Use', routerLink: ''},
      {label: 'Garden Tool Use', routerLink: ''},
      {label: 'Planting Material Consumption', routerLink: ''}
    ];
    this.subTableKey = Object.keys(this.subCols);
  }

  showPhoto(photo) {
    this.photoSrc = photo;
    this.displayPhoto = true;
  }

  showEditForm(toEdit) {
    this.displayEditForm = true;
    console.log(toEdit);
    this.toEdit = toEdit;
  }

  onEditFormClose(disp) {
    this.displayEditForm = disp;
  }

}
