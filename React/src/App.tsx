import { useCallback, useState } from 'react';
import DataGrid, {
  ColumnChooser,
  ColumnFixing,
  Column,
  RequiredRule,
  Sorting,
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
  Export,
  type DataGridTypes,
} from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { Workbook } from 'devextreme-exceljs-fork';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme-react/common/export/excel';
import { jsPDF } from 'jspdf';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import 'devextreme/dist/css/dx.fluent.blue.light.css';
import './App.css';
import { employees, type Employee } from './employees';

const exportFormats = ['xlsx', 'pdf'];

interface SelectedEmployeeProps {
  employee?: Employee;
}

interface DetailSectionProps {
  data: { data: Employee };
}

function SelectedEmployee(props: SelectedEmployeeProps): JSX.Element | null {
  if (props.employee) {
    return (
      <p id="selected-employee">
        Selected employee: {props.employee.FullName}
      </p>
    );
  }
  return null;
}

function DetailSection(props: DetailSectionProps): JSX.Element {
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

function onExporting(e: DataGridTypes.ExportingEvent): void {
  if (e.format === 'xlsx') {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
      component: e.component,
      worksheet,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
      }).catch(() => {});
    }).catch(() => {});
  } else if (e.format === 'pdf') {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: e.component,
    }).then(() => {
      doc.save('DataGrid.pdf');
    }).catch(() => {});
  }
}

function App(): JSX.Element {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [expanded, setExpanded] = useState(true);
  const selectEmployee = useCallback((e: DataGridTypes.SelectionChangedEvent): void => {
    e.component.byKey(e.currentSelectedRowKeys[0]).then((employee: Employee) => {
      setSelectedEmployee(employee);
    }).catch(() => {});
  }, []);

  return (
    <div className="app">
      <DataGrid
        id="data-grid"
        dataSource={employees}
        keyExpr="EmployeeID"
        allowColumnResizing={true}
        columnAutoWidth={true}
        allowColumnReordering={true}
        onSelectionChanged={selectEmployee}
        onExporting={onExporting}>
        <ColumnChooser enabled={true} />
        <Column
          dataField="FullName"
          fixed={true}
        >
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
        <Sorting mode='multiple' />
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
              onClick={(): void => setExpanded((prevExpanded) => !prevExpanded)}
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
