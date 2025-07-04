import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiBase = 'http://localhost:5262/api/Employees'; // Replace with your actual API URL

const EmployeeManager = () => {
  const [skills, setSkills] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeID: '',
    name: '',
    email: '',
    skillIDs: []
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Load skills and employees on first render
  useEffect(() => {
    fetchSkills();
    fetchEmployees();
  }, []);

  // Generate new EmployeeID like E001, E002 ...
  const generateNewEmployeeID = () => {
    if (employees.length === 0) return 'E001';

    const maxIdNumber = employees
      .map(e => parseInt(e.employeeID.substring(1))) // get number part
      .reduce((max, curr) => (curr > max ? curr : max), 0);

    const newIdNumber = maxIdNumber + 1;
    return 'E' + newIdNumber.toString().padStart(3, '0');
  };

  // Auto-set new ID when employees list changes and NOT in edit mode
  useEffect(() => {
    if (!isEditMode) {
      const newId = generateNewEmployeeID();
      setForm(prev => ({ ...prev, employeeID: newId }));
    }
  }, [employees, isEditMode]);

  const fetchSkills = async () => {
    const res = await axios.get(`${apiBase}/skills`);
    setSkills(res.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get(apiBase);
    setEmployees(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (skillId) => {
    if (skillId && !form.skillIDs.includes(skillId)) {
      setForm(prev => ({
        ...prev,
        skillIDs: [...prev.skillIDs, skillId]
      }));
    }
  };

  const handleRemoveSkill = (skillId) => {
    setForm(prev => ({
      ...prev,
      skillIDs: prev.skillIDs.filter(id => id !== skillId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      await axios.put(`${apiBase}/${form.employeeID}`, form);
    } else {
      await axios.post(apiBase, form);
    }
    setForm({ employeeID: '', name: '', email: '', skillIDs: [] });
    setIsEditMode(false);
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setForm({
      employeeID: emp.employeeID,
      name: emp.name,
      email: emp.email,
      skillIDs: skills
        .filter(s => emp.skills.includes(s.skillName))
        .map(s => s.skillID)
    });
    setIsEditMode(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`${apiBase}/${id}`);
      fetchEmployees();
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEditMode ? 'Edit' : 'Add'} Employee</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="form-label">Employee ID</label>
          <input
            type="text"
            className="form-control"
            name="employeeID"
            value={form.employeeID}
            onChange={handleChange}
            readOnly={true}  // always readonly, auto-generated
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Skills Dropdown */}
        <div className="mb-3">
          <label className="form-label">Add Skill</label>
          <div className="input-group">
            <select
              className="form-select"
              value=""
              onChange={(e) => handleAddSkill(e.target.value)}
            >
              <option value="">-- Select a skill --</option>
              {skills
                .filter(skill => !form.skillIDs.includes(skill.skillID))
                .map(skill => (
                  <option key={skill.skillID} value={skill.skillID}>
                    {skill.skillName}
                  </option>
                ))}
            </select>
          </div>

          <div className="mt-2">
            {form.skillIDs.map(skillId => {
              const skill = skills.find(s => s.skillID === skillId);
              return (
                <span key={skillId} className="badge bg-primary me-2 mb-2">
                  {skill?.skillName}
                  <button
                    type="button"
                    className="btn-close btn-close-white btn-sm ms-2"
                    onClick={() => handleRemoveSkill(skillId)}
                    aria-label="Remove"
                  ></button>
                </span>
              );
            })}
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          {isEditMode ? 'Update' : 'Add'} Employee
        </button>
      </form>

      <h2>Employee List</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Skills</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employeeID}>
              <td>{emp.employeeID}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.skills.join(', ')}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(emp.employeeID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManager;
