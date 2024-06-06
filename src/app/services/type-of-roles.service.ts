import { Injectable } from '@angular/core';
import { TypeOfRole } from '../models/typeOfRole.model';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';
import { RoleForEmployee } from '../models/roleForEmployee.model';

@Injectable({
  providedIn: 'root',
})
export class TypeOfRolesService {
  private apiUrl = 'https://localhost:7149/api/TypesOfRoles';
  public rolesList: TypeOfRole[] = [];
  constructor(private http: HttpClient) {
    // this.getRoles().subscribe((roles: TypeOfRole[]) => {
    //   this.rolesList = roles;
    //   console.log("service ctor",this.rolesList); // הדפסה כאן יאפשר לראות את הנתונים במערך
    // });
    this.fetchRoles();
  }

  fetchRoles() {
    this.getRoles().subscribe((roles: TypeOfRole[]) => {
      this.rolesList = roles;
      console.log(roles);
    });
  }

  getRoles(): Observable<TypeOfRole[]> {
    return this.http.get<TypeOfRole[]>(this.apiUrl);
  }
}
