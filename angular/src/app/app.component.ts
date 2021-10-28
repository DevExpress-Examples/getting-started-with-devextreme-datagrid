import { Component } from '@angular/core';
import { Employee, EmployeesService } from './employees.service';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  employees: Employee[] = [];
  selectedEmployee: Employee;
  expanded: Boolean = true;

  constructor(service: EmployeesService) {
    this.employees = service.getEmployees();
    this.selectEmployee = this.selectEmployee.bind(this);
  }

  selectEmployee(e) {
    e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
      if(employee) {
        this.selectedEmployee = employee;
      }
    });
  }

  exportGrid(e) {
    const workbook = new Workbook(); 
    const worksheet = workbook.addWorksheet("Main sheet"); 
    exportDataGrid({ 
        worksheet: worksheet, 
        component: e.component
    }).then(function() {
        workbook.xlsx.writeBuffer().then(function(buffer: BlobPart) { 
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), "DataGrid.xlsx"); 
        }); 
    }); 
    e.cancel = true; 
  }
}
