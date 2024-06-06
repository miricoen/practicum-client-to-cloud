import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
@Component({
  selector: 'app-emp-table',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './emp-table.component.html',
  styleUrl: './emp-table.component.scss',
})
export class EmpTableComponent implements OnInit {
  dataSource = new MatTableDataSource<Employee>();
  private employeesSubscription!: Subscription;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'tz',
    'startDate',
    'delete', // כפתור מחיקה
    'edit', // כפתור עריכה
  ];

  constructor(
    public _employeeService: EmployeeService,
    private _router: Router
  ) {
    this.employeesSubscription = this._employeeService
      .getEmployeesSubject()
      .subscribe(
        (employees: Employee[]) => {
          // this.dataSource.data = employees; // מעדכן את המערך כאשר הנתונים מוכנים
          this.dataSource.data = employees.filter(
            (employee) => employee.status === true
          );
          console.log(this.dataSource); // מדפיס את המערך רק כאשר הוא מעודכן עם הנתונים החדשים
        },
        (error) => {
          console.error('Error fetching employees:', error);
        }
      );
  }
  ngOnInit(): void {}
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteEmployee(id: number) {
    this._employeeService.delete(id);
  }

  addEmployee() {
    this._router.navigate(['/addEmployee']);
  }

  editEmployee(id: number) {
    this._router.navigate([`${id}/editEmployee`]);
  }
  exportToExcel() {
    this._employeeService.exportToExcel();
  }


}
