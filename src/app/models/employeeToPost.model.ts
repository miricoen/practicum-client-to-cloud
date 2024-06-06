import { RoleForEmployee } from './roleForEmployee.model';

export class EmployeeToPost {
  firstName!: string;
  lastName!: string;
  tz!:string;
  startDate!: Date;
  bornDate!: Date;
  isMale!: boolean;
  roles!: RoleForEmployee[];
  status!: boolean;
}
