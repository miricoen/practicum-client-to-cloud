
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { EmpTableComponent } from './components/emp-table/emp-table.component';

export const routes: Routes = [
  { path: '', redirectTo: '/employeesTable', pathMatch: 'full' },
  { path: 'employeesTable', component: EmpTableComponent },
  { path: 'addEmployee', component: AddEmployeeComponent },
  { path: ':id/editEmployee', component: EditEmployeeComponent },
  // ניתן להוסיף נתיבים נוספים כפי שנדרש
];

