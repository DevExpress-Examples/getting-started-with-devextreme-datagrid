import { Component } from '@angular/core';
import { Workbook } from 'dx-exceljs-fork';
import { saveAs } from 'file-saver';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Employee, EmployeesService } from './employees.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  employees: Employee[] = [];

  selectedEmployee: Employee | null = null;

  expanded = true;

  constructor(service: EmployeesService) {
    this.employees = service.getEmployees();
  }

  selectEmployee(e: DxDataGridTypes.SelectionChangedEvent): void {
    e.component.byKey(e.currentSelectedRowKeys[0]).then((employee: Employee | undefined) => {
      if (employee) {
        this.selectedEmployee = employee;
      }
    }).catch(() => { });
  }

  exportGrid(e: DxDataGridTypes.ExportingEvent): void {
    if (e.format === 'xlsx') {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Main sheet');
      exportDataGrid({
        worksheet,
        component: e.component,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
        }).catch(() => { });
      }).catch(() => { });
      e.cancel = true;
    } else if (e.format === 'pdf') {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: e.component,
      }).then(() => {
        doc.save('DataGrid.pdf');
      }).catch(() => { });
    }
  }
}
