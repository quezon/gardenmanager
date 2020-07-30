import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { ImageConverterService } from '../image-converter.service';

@Component({
  selector: 'app-file-wrapper',
  template: `
    <input type="file" 
    (change)="fileChangeEvent($event)"
    [formControl]="formControl" 
    [formlyAttributes]="field" 
    accept=".jpg,.jpeg"
    >
  `,
})
export class FileWrapperComponent extends FieldType {
  MAX_SIZE = 51200;
  constructor(private imageService: ImageConverterService) {
    super();
  }

  fileChangeEvent(event) {
    if (event.target.files[0].size < this.MAX_SIZE) {
      this.imageService.onUploadImage(event).subscribe(
        base64image => {
            // convert image to base64
            // attach base64 string to form
          this.value = base64image
        }
      )
    } else {
      this.value = ""
    }
  }
}