import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-prime-ng-table',
  templateUrl: './prime-ng-table.component.html',
  styleUrls: ['./prime-ng-table.component.css']
})
export class PrimeNgTableComponent implements OnInit {
  @Input('objects') objects: any[]; 
  @Input('cols') cols: any[];
  @Input() domain;

  displayPhoto: boolean;
  displayEditForm: boolean;
  photoSrc;
  toEdit;

  constructor() { 
    console.log(this.objects);
  }

  ngOnInit() {
    // console.log(this.objects);
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
