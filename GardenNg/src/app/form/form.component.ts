import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  
  jsonFormObject: any;
  @Input() formData = {};
  @Input() domain;
  @Input() action;
  @Input() display: boolean;
  @Output() displayChange :  EventEmitter<boolean>;

  form = new FormGroup({});
  fields: FormlyFieldConfig[];
  options: FormlyFormOptions = {}; 

  constructor(private http: HttpClient, private data: DataService) { 
    this.displayChange = new EventEmitter();
  }

  ngOnInit() {
    const schemaURL = `assets/schemas/form/${this.domain}.json`;
    this.http
      .get(schemaURL, { responseType: 'text' })
      .subscribe(schema => {
        let obj_schema: any[] = JSON.parse(schema);
        obj_schema.forEach((field, idx, arr) => {
          if( Object.keys(field['templateOptions']).includes("options") ) {
            arr[idx]['templateOptions']['options'] = eval( field['templateOptions']['options'] );
          }

          console.log(field)

          if( Object.keys(field).includes('fieldArray') ) {
            console.log( field['fieldArray']['fieldGroup']); 
            field['fieldArray']['fieldGroup'].forEach((field2, idx2) => {
              console.log(field2);
              if( Object.keys(field2['templateOptions']).includes("options") ) {
                arr[idx]['fieldArray']['fieldGroup'][idx2]['templateOptions']['options'] = eval( field2['templateOptions']['options'] );
              }
            });
          }
        })
        this.fields = obj_schema;
      }); 
  }

  hideDialog() {
    this.display = !this.display;
    this.displayChange.emit(false);
  }

  onSubmit() {
    console.log(this.form);
    if (this.form.valid) {
      this.hideDialog();
      // this.form.reset();
      this.options.resetModel();
    }
  }
}
