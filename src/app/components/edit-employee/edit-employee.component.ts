import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { TypeOfRole } from '../../models/typeOfRole.model';
import { TypeOfRolesService } from '../../services/type-of-roles.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeToPost } from '../../models/employeeToPost.model';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss',
})
export class EditEmployeeComponent implements OnInit {
  editEmployeeForm!: FormGroup;
  currentEmployee!: Employee;
  typeOfRoles: TypeOfRole[] = [];
  fname!: string;
  rolesFormArray!: FormArray<any>;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _employeeService: EmployeeService,
    private _formBuilder: FormBuilder,
    public _typeOfRolesService: TypeOfRolesService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(async (param) => {
      const fetchedEmpId = param['id'];
      console.log(fetchedEmpId);
      (await this._employeeService.getEmpById(fetchedEmpId)).subscribe(
        (emp: Employee) => {
          if (emp) {
            this.currentEmployee = emp;
            console.log(this.currentEmployee);

            // Create the form only when data is available
            this.initForm();
            console.log(this.editEmployeeForm);
          }
        }
      );

      this._typeOfRolesService.getRoles().subscribe((roles: TypeOfRole[]) => {
        this.typeOfRoles = roles;
        console.log('cpmponent', this.typeOfRoles);
      });
    });
  }

  public initForm(): void {
    this.editEmployeeForm = this._formBuilder.group({
      firstName: new FormControl(this.currentEmployee.firstName, [
        Validators.required,
      ]),
      lastName: new FormControl(this.currentEmployee.lastName, [
        Validators.required,
      ]),

      tz: new FormControl(this.currentEmployee.tz, [
        Validators.required,
        Validators.pattern(/^\d{9}$/),
      ]),

      bornDate: new FormControl(this.currentEmployee.bornDate, [
        Validators.required,
      ]),

      startDate: new FormControl(this.currentEmployee.startDate, [
        Validators.required,
      ]),

      isMale: new FormControl(this.currentEmployee.isMale, [
        Validators.required,
      ]),
      roles: this._formBuilder.array([]),
    });
    this.rolesFormArray = this.editEmployeeForm.get('roles') as FormArray;

    this.showRols();
  }

  showRols() {
    this.currentEmployee.roles.forEach((role) => {
      // this.rolesFormArray = this.editEmployeeForm.get('roles') as FormArray;
      this.rolesFormArray.push(
        this._formBuilder.group({
          typesOfRolesId: new FormControl(role.typesOfRolesId, [
            Validators.required,
          ]),
          isManagement: new FormControl(role.isManagement, [
            Validators.required,
          ]),
          dateOfEntryIntoWork: new FormControl(role.dateOfEntryIntoWork, [
            Validators.required,
          ]),
        })
      );
    });
  }

  addRole() {
    // this.rolesFormArray = this.editEmployeeForm.get('roles') as FormArray;
    this.rolesFormArray.push(
      this._formBuilder.group({
        typesOfRolesId: new FormControl(0, [Validators.required]),
        isManagement: new FormControl(true),
        dateOfEntryIntoWork: new FormControl(new Date()),
      })
    );
  }

  removeRole(index: number): void {
    // this.rolesFormArray = this.editEmployeeForm.get('roles') as FormArray;
    this.rolesFormArray.removeAt(index);
  }

  filterBornDate = (d: Date | null): boolean => {
    const seventyYearsAgo = new Date();
    seventyYearsAgo.setFullYear(seventyYearsAgo.getFullYear() - 70);

    return !!(d && d.getTime() > seventyYearsAgo.getTime());
  };

  filterStartDate = (d: Date | null): boolean => {
    const minWorkStartDate = new Date(
      this.editEmployeeForm.get('bornDate')!.value!
    );
    minWorkStartDate.setFullYear(minWorkStartDate.getFullYear() + 18);

    return !d || d >= minWorkStartDate;
  };

  filterDateOfEntry = (d: Date | null): boolean => {
    const minWorkStartDate = new Date(
      this.editEmployeeForm.get('startDate')!.value!
    );
    minWorkStartDate.setFullYear(minWorkStartDate.getFullYear());

    return !d || d >= minWorkStartDate;
  };

  cancle() {
    this._router.navigate(['/employeesTable']);
  }

  onSubmit() {
    this.currentEmployee.firstName =
      this.editEmployeeForm.get('firstName')!.value!;
    this.currentEmployee.lastName =
      this.editEmployeeForm.get('lastName')!.value!;
    this.currentEmployee.tz = this.editEmployeeForm.get('tz')!.value!;
    this.currentEmployee.startDate = new Date(
      this.editEmployeeForm.get('startDate')!.value!
    );
    this.currentEmployee.bornDate = new Date(
      this.editEmployeeForm.get('bornDate')!.value!
    );
    this.currentEmployee.isMale =
      this.editEmployeeForm.get('isMale')!.value === true;
    this.currentEmployee.status = true;

    const transformedData = this.rolesFormArray.value.map(
      (item: {
        typesOfRolesId: number;
        isManagement: boolean;
        dateOfEntryIntoWork: Date;
      }) => ({
        typesOfRolesId: item.typesOfRolesId,
        isManagement: item.isManagement === true,
        dateOfEntryIntoWork: item.dateOfEntryIntoWork,
      })
    );

    this.currentEmployee.roles = transformedData;

    console.log(this.currentEmployee);

    this._employeeService
      .editEmployee(this.currentEmployee.id, this.currentEmployee)
      .subscribe({
        next: () => {
          console.log('Employee edited successfully');
          Swal.fire({
            icon: 'success',
            text: 'עובד השתנה בהצלחה!',
            showConfirmButton: false,
            timer: 1500,
          });
          this._router.navigate(['/employeesTable']);
        },
        error: (error) => {
          console.error('Error edit employee:', error);
          Swal.fire({
            icon: 'error',
            text: 'מצטערים, קרתה שגיאה בתהליך',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
  }
}
