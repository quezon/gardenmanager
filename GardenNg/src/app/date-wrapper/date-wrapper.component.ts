import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-date-wrapper',
  templateUrl: './date-wrapper.component.html',
  styleUrls: ['./date-wrapper.component.css']
})
export class DateWrapperComponent extends FieldWrapper {
  constructor() {
    super();

    //console.log(this.field)
    //console.log(this.key)
    
    //console.log(this.form)
  }
}
