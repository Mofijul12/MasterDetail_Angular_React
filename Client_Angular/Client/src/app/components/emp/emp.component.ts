import { Component, OnInit } from '@angular/core';
import { EmployeeDto, EmployeeViewDto, EmpService, Skill } from 'src/app/services/emp.service';

@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.css']
})
export class EmpComponent implements OnInit {
  skills: Skill[] = [];
  employees: EmployeeViewDto[] = [];

  employee: EmployeeDto = {
    employeeID: '',
    name: '',
    email: '',
    skillIDs: ['']
  };

  isEditMode = false;
  originalEmployeeID = '';

  constructor(private empService: EmpService) {}

  ngOnInit(): void {
    this.loadSkills();
    this.loadEmployees();
  }

  loadSkills(): void {
    this.empService.getSkills().subscribe(data => {
      this.skills = data;
    });
  }

  loadEmployees(): void {
    this.empService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  addSkillField(): void {
    this.employee.skillIDs.push('');
  }

  removeSkillField(index: number): void {
    if (this.employee.skillIDs.length > 1) {
      this.employee.skillIDs.splice(index, 1);
    }
  }

  onSubmit(): void {
    const cleanedSkills = this.employee.skillIDs.filter(id => id && id.trim() !== '');

    const payload: EmployeeDto = {
      ...this.employee,
      skillIDs: cleanedSkills
    };

    if (this.isEditMode) {
      this.empService.updateEmployee(this.originalEmployeeID, payload).subscribe({
        next: () => {
          alert('Employee updated successfully!');
          this.loadEmployees();
          this.resetForm();
        },
        error: () => alert('Error updating employee')
      });
    } else {
      this.empService.addEmployee(payload).subscribe({
        next: () => {
          alert('Employee added successfully!');
          this.loadEmployees();
          this.resetForm();
        },
        error: () => alert('Error adding employee')
      });
    }
  }

  editEmployee(emp: EmployeeViewDto): void {
    this.employee = {
      employeeID: emp.employeeID,
      name: emp.name,
      email: emp.email,
      skillIDs: [] // skill names → IDs to fetch separately
    };

    // fetch original data with skill IDs
    this.empService.getEmployee(emp.employeeID).subscribe(data => {
      this.employee.skillIDs = data.skills.map(skillName => {
        const skill = this.skills.find(s => s.skillName === skillName);
        return skill ? skill.skillID : '';
      });
    });

    this.originalEmployeeID = emp.employeeID;
    this.isEditMode = true;
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure to delete this employee?')) {
      this.empService.deleteEmployee(id).subscribe({
        next: () => {
          alert('Employee deleted');
          this.loadEmployees();
        },
        error: () => alert('Error deleting employee')
      });
    }
  }

  resetForm(): void {
    this.employee = {
      employeeID: '',
      name: '',
      email: '',
      skillIDs: ['']
    };
    this.isEditMode = false;
    this.originalEmployeeID = '';
  }
}
