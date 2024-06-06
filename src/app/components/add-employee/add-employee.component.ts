import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleForEmployee } from '../../models/roleForEmployee.model';
import { TypeOfRole } from '../../models/typeOfRole.model';
import { TypeOfRolesService } from '../../services/type-of-roles.service';
import { Employee } from '../../models/employee.model';
import { EmployeeToPost } from '../../models/employeeToPost.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService } from '../../services/employee.service';
@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit {
  // errorMessage!: string;
  // successMessage!: string;
  // roleToAdd!: RoleForEmployee;
  // addEmployeeForm!: FormGroup;
  rolesArray: RoleForEmployee[] = [];
  typeOfRoles: TypeOfRole[] = [];
  // rolesFormArray!: FormArray;
  employeeFinal: EmployeeToPost = new EmployeeToPost();

  constructor(
    private _formBuilder: FormBuilder,
    public _typeOfRolesService: TypeOfRolesService,
    private _router: Router,
    private _employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this._typeOfRolesService.getRoles().subscribe((roles: TypeOfRole[]) => {
      this.typeOfRoles = roles;
      console.log('cpmponent', this.typeOfRoles);
    });

    // // הוספת פרטי העבודה למערך בסופו של הפורם
  }

  addEmployeeForm = this._formBuilder.group({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    tz: new FormControl('123456789', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
    ]),
    isMale: new FormControl('true'), // ברירת מחדל - זכר
    startDate: new FormControl(new Date()), // תאריך התחלת עבודה
    bornDate: new FormControl(new Date()), // תאריך לידה

    roles: this._formBuilder.array([
      this._formBuilder.group({
        typeOfRoleId: new FormControl('', Validators.required),
        isManegement: new FormControl('true'),
        DateOfEntryIntoWork: new FormControl(new Date()),
      }),
    ]),
  });
  rolesFormArray = this.addEmployeeForm.get('roles') as FormArray;
  // פונקציה להוספת פרטי העבודה
  addRole() {
    this.rolesFormArray = this.addEmployeeForm.get('roles') as FormArray;
    this.rolesFormArray.push(
      this._formBuilder.group({
        typeOfRoleId: new FormControl('', Validators.required),
        isManagement: new FormControl('true'),
        DateOfEntryIntoWork: new FormControl(new Date()),
      })
    );
  }

  // פונקציה למחיקת פרטי העבודה האחרונים
  removeRole(index: number) {
    this.rolesFormArray = this.addEmployeeForm.get('roles') as FormArray;
    this.rolesFormArray.removeAt(index);
  }

  filterBornDate = (d: Date | null): boolean => {
    const seventyYearsAgo = new Date();
    seventyYearsAgo.setFullYear(seventyYearsAgo.getFullYear() - 70);

    return !!(d && d.getTime() > seventyYearsAgo.getTime());
  };

  filterStartDate = (d: Date | null): boolean => {
    const minWorkStartDate = new Date(
      this.addEmployeeForm.get('bornDate')!.value!
    );
    minWorkStartDate.setFullYear(minWorkStartDate.getFullYear() + 18);

    return !d || d >= minWorkStartDate;
  };

  filterDateOfEntry = (d: Date | null): boolean => {
    const minWorkStartDate = new Date(
      this.addEmployeeForm.get('startDate')!.value!
    );
    minWorkStartDate.setFullYear(minWorkStartDate.getFullYear());

    return !d || d >= minWorkStartDate;
  };

  cancle() {
    this._router.navigate(['/employeesTable']);
  }

  onSubmit(): void {
    //Group the content of form into an object of type employeeToPost
    this.employeeFinal.firstName =
      this.addEmployeeForm.get('firstName')!.value ?? '';
    this.employeeFinal.lastName =
      this.addEmployeeForm.get('lastName')!.value ?? '';
    this.employeeFinal.tz = this.addEmployeeForm.get('tz')!.value ?? '';
    this.employeeFinal.startDate =
      this.addEmployeeForm.get('startDate')!.value || new Date();
    this.employeeFinal.bornDate =
      this.addEmployeeForm.get('bornDate')!.value || new Date();
    this.employeeFinal.isMale =
      this.addEmployeeForm.get('isMale')!.value === 'true';
    this.employeeFinal.roles = this.addEmployeeForm
      .get('roles')!
      .value.map((role: any) => {
        return {
          typesOfRolesId: role.typeOfRoleId,
          isManagement: role.isManegement,
          dateOfEntryIntoWork: role.DateOfEntryIntoWork,
        };
      });
    this.employeeFinal.status = true;
    console.log(this.employeeFinal);
    this._employeeService.addEmployee(this.employeeFinal).subscribe((res) => {
      Swal.fire({
        title: 'העובד נוסף בהצלחה',
        icon: 'success',
      });
      this._router.navigate(['/employeesTable']);
    });
  }
}
