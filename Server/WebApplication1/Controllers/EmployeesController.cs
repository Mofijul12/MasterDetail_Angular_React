using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DTO;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Get all skills for dropdown
        [HttpGet("skills")]
        public async Task<ActionResult<IEnumerable<SkillDto>>> GetSkills()
        {
            return await _context.Skills
                .Select(s => new SkillDto
                {
                    SkillID = s.SkillID,
                    SkillName = s.SkillName
                })
                .ToListAsync();
        }

        // 🔹 Create employee with skills and return employee with skill names
        [HttpPost]
        public async Task<ActionResult<EmployeeViewDto>> CreateEmployee(EmployeeDto dto)
        {
            var employee = new Employee
            {
                EmployeeID = dto.EmployeeID,
                Name = dto.Name,
                Email = dto.Email,
                EmployeeSkills = dto.SkillIDs.Select(skillId => new EmployeeSkill
                {
                    SkillID = skillId
                }).ToList()
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return await GetEmployeeViewById(dto.EmployeeID);
        }

        // 🔹 Get employee by ID with skill names
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeViewDto>> GetEmployee(string id)
        {
            var employeeDto = await GetEmployeeViewById(id);

            if (employeeDto == null)
                return NotFound();

            return Ok(employeeDto);
        }

        // 🔹 Get all employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeViewDto>>> GetAllEmployees()
        {
            var employees = await _context.Employees
                .Include(e => e.EmployeeSkills)
                    .ThenInclude(es => es.Skill)
                .ToListAsync();

            return employees.Select(e => new EmployeeViewDto
            {
                EmployeeID = e.EmployeeID,
                Name = e.Name,
                Email = e.Email,
                Skills = e.EmployeeSkills.Select(es => es.Skill.SkillName).ToList()
            }).ToList();
        }

        // 🔹 Update employee and their skills
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(string id, EmployeeDto dto)
        {
            var employee = await _context.Employees
                .Include(e => e.EmployeeSkills)
                .FirstOrDefaultAsync(e => e.EmployeeID == id);

            if (employee == null)
                return NotFound();

            employee.Name = dto.Name;
            employee.Email = dto.Email;

            // Remove existing skills
            _context.EmployeeSkills.RemoveRange(employee.EmployeeSkills);

            // Add new skills
            employee.EmployeeSkills = dto.SkillIDs.Select(skillId => new EmployeeSkill
            {
                SkillID = skillId,
                EmployeeID = id
            }).ToList();

            await _context.SaveChangesAsync();

            return Ok(await GetEmployeeViewById(id));
        }

        // 🔹 Delete employee by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(string id)
        {
            var employee = await _context.Employees
                .Include(e => e.EmployeeSkills)
                .FirstOrDefaultAsync(e => e.EmployeeID == id);

            if (employee == null)
                return NotFound();

            _context.EmployeeSkills.RemoveRange(employee.EmployeeSkills);
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // 🔹 Private helper to get EmployeeViewDto by ID
        private async Task<EmployeeViewDto?> GetEmployeeViewById(string id)
        {
            return await _context.Employees
                .Include(e => e.EmployeeSkills)
                    .ThenInclude(es => es.Skill)
                .Where(e => e.EmployeeID == id)
                .Select(e => new EmployeeViewDto
                {
                    EmployeeID = e.EmployeeID,
                    Name = e.Name,
                    Email = e.Email,
                    Skills = e.EmployeeSkills.Select(es => es.Skill.SkillName).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
