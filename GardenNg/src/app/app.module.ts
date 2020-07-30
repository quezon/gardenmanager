import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from "ngx-schema-form";
import { MaterialDesignFrameworkModule } from 'angular6-json-schema-form';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TreeTableModule } from 'primeng/treetable';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import {ToastModule} from 'primeng/toast';
import {ScrollPanelModule} from 'primeng/scrollpanel';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

// import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { NavService } from './nav.service';
import { CreateComponent } from './create/create.component';
import { TabulatorTableComponent } from './tabulator-table/tabulator-table.component';
import { ViewTableComponent } from './view-table/view-table.component';
import { FormComponent } from './form/form.component';
import { PrimeNgTableComponent } from './prime-ng-table/prime-ng-table.component';
import { DataService } from './data.service';
import { DateWrapperComponent } from './date-wrapper/date-wrapper.component';

import { FileWrapperComponent } from './file-wrapper/file-wrapper.component';
import { FileValueAccessorDirective } from './file-value-accessor.directive';
import { PrimeNgTreeTableComponent } from './prime-ng-tree-table/prime-ng-tree-table.component';
import { RepeatTypeComponent } from './repeat-type/repeat-type.component';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuListItemComponent,
    CreateComponent,
    TabulatorTableComponent,
    ViewTableComponent,
    FormComponent,
    PrimeNgTableComponent,
    DateWrapperComponent,
    FileWrapperComponent,
    FileValueAccessorDirective,
    PrimeNgTreeTableComponent,
    RepeatTypeComponent
  ],
  imports: [
    //prime ng
    TableModule,
    SplitButtonModule,
    DialogModule,
    CalendarModule,
    TreeTableModule,
    TabMenuModule,
    MenubarModule,
    PanelMenuModule,
    AccordionModule,
    TabViewModule,
    ToastModule,
    ScrollPanelModule,
    // angular
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // angular material
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    FormlyMatDatepickerModule,
    MatNativeDateModule,
    //
    MaterialDesignFrameworkModule,
    SchemaFormModule.forRoot(),
    //
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
      wrappers: [
        // { name: 'datepick', component: DateWrapperComponent },
      ],
      types: [
        { name: 'repeat', component: RepeatTypeComponent },
        { name: 'file', component: FileWrapperComponent, wrappers: ['form-field']},
        { name: 'datepick', component: DateWrapperComponent },
      ],
    }),
    //FormlyPrimeNGModule,
    FormlyMaterialModule,
    FormlyModule.forRoot(),
  ],
  providers: [NavService, DataService, {provide: WidgetRegistry, useClass: DefaultWidgetRegistry}],
  bootstrap: [AppComponent]
})
export class AppModule { }
