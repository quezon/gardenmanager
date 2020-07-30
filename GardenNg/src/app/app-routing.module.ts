import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTableComponent } from './view-table/view-table.component';

const routes: Routes = [
  {path: 'Chemical', component: ViewTableComponent, data: 
    { 
      cols: [
    { field: 'tradeName', header: 'Trade Name' },
    { field: 'manufacturer', header: 'Manufacturer' },
    { field: 'dateAcquired', header: 'Date Acquired' },
    { field: 'cost', header: 'Cost' },
    { field: 'qtyAcquired', header: 'Qty Acquired' },
    { field: 'qtyUsed', header: 'Qty Used' },
    { field: "unitOfMeasure.baseUnit", header: 'U/M' },
    { field: "storage.description", header: 'Storage' },
    { field: 'photo64', header: 'Action'}
  ]}},
  {path: 'GardenTool', component: ViewTableComponent, data: {cols: [
    { field: 'toolName', header: 'Tool Name' },
    { field: 'dateAcquired', header: 'Date Acquired' },
    { field: 'cost', header: 'Cost' },
    { field: 'photo64', header: 'Action'},
  ]}},
  {path: 'Plant', component: ViewTableComponent, data: {cols: [
    { field: 'scientificName', header: 'Scientific Name' },
    { field: 'commonName', header: 'Common Name' },
    { field: 'cultivar', header: 'Cultivar' },
    { field: 'photo64', header: 'Action' }
  ]}},
  {path: 'PlantingMaterial', component: ViewTableComponent, data: {cols: 
    [
      { field: 'id', header: 'PM Id'},
      { field: 'plant.completeName', header: 'Plant Name' },
      { field: 'materialType', header: 'Material Type' },
      { field: 'vendor', header: 'Vendor' },
      { field: 'dateAcquired', header: 'Date Acquired' },
      { field: 'cost', header: 'Cost' },
      { field: 'qtyAcquired', header: 'Qty Acquired' },
      { field: 'qtyUsed', header: 'Qty Used' },
      { field: 'unitOfMeasure.baseUnit', header: 'Unit of Measure' },
      { header: 'Action'}
  ]}},
  {path: 'Storage', component: ViewTableComponent, data: {cols: 
    [
      { field: 'id', header: 'Storage Id' },
      { field: 'description', header: 'Description' },
      { field: 'photo64', header: 'Action', iden: 'storageId' }
  ]}},
  {path: 'UnitOfMeasure', component: ViewTableComponent, data: {cols: 
    [
      { field: 'baseUnit', header: 'Base Unit' },
      { field: 'measureType', header: 'Measure Type' },
      { field: 'symbol', header: 'Symbol' },
      { header: 'Action'}
  ]}},
  {path: 'WorkPerformed', component: ViewTableComponent, data: {cols: 
    [
      { field: 'performedBy', header: 'Performed By' },
      { field: 'checkedBy', header: 'Checked By' },
      { field: 'workType', header: 'Work Type' },
      { field: 'startDateTime', header: 'Date Started' },
      { field: 'endDateTime', header: 'Date Ended' },
      { header: 'Action'}
      // planting materials used, chemicals used, garden tools used go to a subtable
    ],
    nestedTable: true,
    subTable: ['Chemical Use','Garden Tool Use','Planting Material Consumption'],
    subCols: {
      chemicalsUsed : [
        {field: 'id', header: 'ID'},
        {field: 'tradeName', header: 'Chemical Name'},
        {field: 'qtyUsed', header: ' Qty Used'}
      ],
      gardenToolsUsed: [
        {field: 'id', header: 'ID'},
        {field: 'toolName', header: 'Tool Name'},
      ],
      plantingMaterialsUsed : [
        {field: 'id', header: 'ID'},
        {field: 'scientificName', header: 'Scientific Name'},
        {field: 'qtyUsed', header: ' Qty Used'},
        {field: 'qtyTransformed', header: 'Qty Transformed'}
      ],
    }
  }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
