import React, { useCallback, useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import './App.css'

import {
  DataGrid,
  ColumnChooser,
  ColumnFixing,
  Column,
  RequiredRule,
  FilterRow,
  SearchPanel,
  GroupPanel,
  Selection,
  Summary,
  GroupItem,
  Editing,
  Grouping,
  Toolbar,
  Item,
  MasterDetail,
  Export
} from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { employees } from './employees';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { jsPDF } from 'jspdf';
import { exportDataGrid as exportDataGridToPdf} from 'devextreme/pdf_exporter';

const exportFormats = ['xlsx', 'pdf'];

function SelectedEmployee(props) {
  if(props.employee) {
    return (
      <p id="selected-employee">
        Selected employee: {props.employee.FullName}
      </p>
    );
  }
  return null;
}

function DetailSection(props) {
  const employee = props.data.data;
  return (
    <div>
      <img
        className="employee-photo"
        alt={employee.FullName}
        src={employee.Photo}
      />
      <p className="employee-notes">{employee.Notes}</p>
    </div>
  );
}

function exportGrid(e) {
  if (e.format === 'xlsx') {
    const workbook = new Workbook(); 
    const worksheet = workbook.addWorksheet("Main sheet"); 
    exportDataGrid({ 
      worksheet: worksheet, 
      component: e.component,
    }).then(function() {
      workbook.xlsx.writeBuffer().then(function(buffer) { 
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "DataGrid.xlsx"); 
      }); 
    }); 
    e.cancel = true;
  } 
  else if (e.format === 'pdf') {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: e.component,
    }).then(() => {
      doc.save('DataGrid.pdf');
    });
  }
}

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [expanded, setExpanded] = useState(true);
  const selectEmployee = useCallback((e) => {
    e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
        setSelectedEmployee(employee);
    });
  }, []);

  return (
    <div className="App">
      <DataGrid
        id="dataGrid"
        dataSource={employees}
        keyExpr="EmployeeID"
        allowColumnResizing={true}
        columnAutoWidth={true}
        allowColumnReordering={true}
        onSelectionChanged={selectEmployee}
        onExporting={exportGrid}>
        <ColumnChooser enabled={true} />
        <Column dataField="FullName">
          <RequiredRule />
        </Column>
        <Column dataField="Position">
          <RequiredRule />
        </Column>
        <Column
          dataField="BirthDate"
          dataType="date"
          width={100}>
          <RequiredRule />
        </Column>
        <Column
          dataField="HireDate"
          dataType="date"
          width={100}>
          <RequiredRule />
        </Column>
        <Column dataField="City" />
        <Column
          dataField="Country"
          groupIndex={0}
          sortOrder="asc">
          <RequiredRule />
        </Column>
        <Column dataField="Address" />
        <Column dataField="HomePhone" />
        <Column dataField="PostalCode" visible={false} />
        <ColumnFixing enabled={true} />
        <FilterRow visible={true} />
        <SearchPanel visible={true} />
        <GroupPanel visible={true} />
        <Selection mode="single" />
        <Summary>
          <GroupItem
            summaryType="count"
          />
        </Summary>
        <Editing
          mode="popup"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <Grouping autoExpandAll={expanded} />
        <Toolbar>
          <Item name="groupPanel" />
          <Item location="after">
            <Button
                text={expanded ? 'Collapse All' : 'Expand All'}
                width={136}
                onClick={() => setExpanded(prevExpanded => !prevExpanded)}
            />
          </Item>
          <Item name="addRowButton" showText="always" />
          <Item name="exportButton" />
          <Item name="columnChooserButton" />
          <Item name="searchPanel" />
        </Toolbar>
        <MasterDetail
          enabled={true}
          component={DetailSection}
        />
        <Export enabled={true} formats={exportFormats} />
      </DataGrid>
      <SelectedEmployee employee={selectedEmployee} />
    </div>
  );
}

export default App;
