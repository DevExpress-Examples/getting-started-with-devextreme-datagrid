<template>
  <div id="app-container">
    <DxDataGrid
      id="dataGrid"
      :data-source="employees"
      key-expr="EmployeeID"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :allow-column-reordering="true"
      @selection-changed="selectEmployee"
      @exporting="exportGrid"
    >
      <DxColumn
        data-field="FullName"
        :fixed="true"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="Position">
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
        :width="100"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn
        data-field="HireDate"
        data-type="date"
        :width="100"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="City"/>
      <DxColumn
        data-field="Country"
        :group-index="0"
        sort-order="asc"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="Address"/>
      <DxColumn data-field="HomePhone"/>
      <DxColumn
        data-field="PostalCode"
        :visible="false"
      />
      <DxColumnChooser :enabled="true"/>
      <DxColumnFixing :enabled="true"/>
      <DxFilterRow :visible="true"/>
      <DxSearchPanel :visible="true"/>
      <DxGroupPanel :visible="true"/>
      <DxSelection mode="single"/>
      <DxSummary>
        <DxGroupItem summary-type="count"/>
      </DxSummary>
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
      />
      <DxGrouping :auto-expand-all="expanded"/>
      <DxToolbar>
        <DxItem name="groupPanel"/>
        <DxItem
          location="after"
          template="button-template"
        />
        <DxItem
          name="addRowButton"
          show-text="always"
        />
        <DxItem name="exportButton"/>
        <DxItem name="columnChooserButton"/>
        <DxItem name="searchPanel"/>
      </DxToolbar>
      <template #button-template>
        <DxButton
          :text="expanded ? 'Collapse All' : 'Expand All'"
          :width="136"
          @click="expanded = !expanded"
        />
      </template>
      <DxMasterDetail
        :enabled="true"
        template="employee-info"
      />
      <template #employee-info="{ data: employee }">
        <div>
          <img
            class="employee-photo"
            :src="employee.data.Photo"
            :alt="employee.data.FullName"
          >
          <p class="employee-notes">{{ employee.data.Notes }}</p>
        </div>
      </template>
      <DxExport
        :enabled="true"
        :formats="['xlsx', 'pdf']"
      />
    </DxDataGrid>
    <p
      id="selected-employee"
      v-if="selectedEmployee"
    >
      Selected employee: {{ selectedEmployee.FullName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxColumnChooser,
  DxColumnFixing,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxSelection,
  DxSummary,
  DxGroupItem,
  DxEditing,
  DxGrouping,
  DxToolbar,
  DxItem,
  DxMasterDetail,
  DxExport
} from 'devextreme-vue/data-grid';
import { DxButton } from 'devextreme-vue/button';
import employeesService, { type Employee } from '../employees.service';
import { Workbook } from 'devextreme-exceljs-fork';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { jsPDF } from 'jspdf';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

import 'devextreme/dist/css/dx.fluent.blue.light.css';

// Reactive data
const employees = ref<Employee[]>(employeesService.getEmployees());
const selectedEmployee = ref<Employee | undefined>();
const expanded = ref<boolean>(true);

// Methods
function selectEmployee(e: any): void {
  e.component.byKey(e.currentSelectedRowKeys[0]).done((employee: Employee) => {
    if (employee) {
      selectedEmployee.value = employee;
    }
  });
}

function exportGrid(e: any): void {
  if (e.format === 'xlsx') {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
      worksheet: worksheet,
      component: e.component,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
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
</script>

<style scoped>
.employee-photo {
  height: 140px;
  float: left;
  padding: 0 20px 20px 0;
}

.employee-notes {
  text-align: justify;
  white-space: normal;
}

#dataGrid {
  height: 500px;
}

#app-container {
  position: relative;
}

#selected-employee {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
