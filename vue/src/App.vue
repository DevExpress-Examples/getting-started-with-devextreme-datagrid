<template>
  <div id="app">
    <DxDataGrid
      :data-source="employees"
      key-expr="EmployeeID"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :allow-column-reordering="true"
      @selection-changed="selectEmployee"
      @exporting="exportGrid">
      <DxColumn data-field="FullName">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="Position">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
        :width="150">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="HireDate"
        data-type="date"
        :width="150">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="City" />
      <DxColumn
        data-field="Country"
        :group-index="0"
        sort-order="asc">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="Address" />
      <DxColumn data-field="HomePhone" />
      <DxColumn data-field="PostalCode" :visible="false" />
      <DxColumnChooser :enabled="true" />
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxSelection mode="multiple" />
      <DxSummary>
        <DxTotalItem
          summary-type="count"
          show-in-column="HomePhone"
        />
      </DxSummary>
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
      />
      <DxMasterDetail
        :enabled="true"
        template="employee-info"
      />
      <template #employee-info="{ data: employee }">
        <div>
          <img class="employee-photo" :src="employee.data.Photo">
          <p class="employee-notes">{{ employee.data.Notes }}</p>
        </div>
      </template>
      <DxExport :enabled="true" />
    </DxDataGrid>
    <p id="selected-employee" v-if="selectedEmployee">
      Selected employee: {{ selectedEmployee.FullName }}
    </p>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxColumnChooser,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxSelection,
  DxSummary,
  DxTotalItem,
  DxEditing,
  DxMasterDetail,
  DxExport
} from 'devextreme-vue/data-grid';
import service from './employees.service';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';


export default {
  name: 'App',
  components: {
    DxDataGrid,
    DxColumn,
    DxRequiredRule,
    DxColumnChooser,
    DxFilterRow,
    DxSearchPanel,
    DxGroupPanel,
    DxSelection,
    DxSummary,
    DxTotalItem,
    DxEditing,
    DxMasterDetail,
    DxExport
  },
  data() {
    return {
      employees: service.getEmployees(),
      selectedEmployee: undefined,
    }
  },
  methods: {
    selectEmployee(e) {
      e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
        if(employee) {
          this.selectedEmployee = employee;
        }
      });
    },
    exportGrid(e) {
      const workbook = new Workbook(); 
      const worksheet = workbook.addWorksheet("Main sheet"); 
      exportDataGrid({ 
          worksheet: worksheet, 
          component: e.component
      }).then(function() {
          workbook.xlsx.writeBuffer().then(function(buffer) { 
              saveAs(new Blob([buffer], { type: "application/octet-stream" }), "DataGrid.xlsx"); 
          }); 
      }); 
      e.cancel = true; 
    }
  }
}
</script>

<style>
.employee-photo {
  height: 140px;
  float: left;
  padding: 0 20px 20px 0;
}
  
.employee-notes {
  text-align: justify;
  white-space: normal;
}

#selected-employee {
  text-align: center;
}
</style>
