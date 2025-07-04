import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interface for Skill dropdown
export interface Skill {
  skillID: string;
  skillName: string;
}

// DTO used when posting employee data
export interface EmployeeDto {
  employeeID: string;
  name: string;
  email: string;
  skillIDs: string[]; // Skill IDs selected by user
}

// View DTO used to show employee data with skill names
export interface EmployeeViewDto {
  employeeID: string;
  name: string;
  email: string;
  skills: string[]; // Skill names
}

@Injectable({
  providedIn: 'root'
})
export class EmpService {
  private baseUrl = 'http://localhost:5262/api/Employees';

  constructor(private http: HttpClient) {}

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/skills`);
  }

  getEmployees(): Observable<EmployeeViewDto[]> {
    return this.http.get<EmployeeViewDto[]>(this.baseUrl);
  }

  getEmployee(id: string): Observable<EmployeeViewDto> {
    return this.http.get<EmployeeViewDto>(`${this.baseUrl}/${id}`);
  }

  addEmployee(employee: EmployeeDto): Observable<EmployeeViewDto> {
    return this.http.post<EmployeeViewDto>(this.baseUrl, employee);
  }

  updateEmployee(id: string, employee: EmployeeDto): Observable<EmployeeViewDto> {
    return this.http.put<EmployeeViewDto>(`${this.baseUrl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}