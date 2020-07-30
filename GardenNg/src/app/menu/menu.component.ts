import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  
  shouldRun = true;
  options;

  constructor(fb: FormBuilder) {
    this.options = {
      bottom: 0,
      fixed: false,
      top: 10
    };
  }

  ngOnInit() {
  }

}
