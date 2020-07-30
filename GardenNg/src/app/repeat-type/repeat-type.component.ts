import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'app-repeat-type',
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index;" class="row">
      <formly-field class="col" [field]="field"></formly-field>
      <div class="col-sm-2 d-flex align-items-center">
        <button class="btn btn-danger" type="button" (click)="remove(i)">Remove</button>
      </div>
    </div>
    <div style="margin:30px 0;">
      <button class="btn btn-primary" type="button" (click)="add()">{{ to.addText }}</button>
    </div>
  `,
  styleUrls: ['./repeat-type.component.css']
})
export class RepeatTypeComponent extends  FieldArrayType{
}
