import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ MatButtonModule, MatIconModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  constructor(
    private _router: Router,
    private _employeeService: EmployeeService
  ) {}

  addEmployee() {
    this._router.navigate(['/addEmployee']);
  }
  exportToExcel() {
    this._employeeService.exportToExcel();
  }
}
