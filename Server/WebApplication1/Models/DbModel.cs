namespace WebApplication1.Models
{
    public class Employee
    {
        public string EmployeeID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public ICollection<EmployeeSkill> EmployeeSkills { get; set; }
    }

    public class Skill
    {
        public string SkillID { get; set; }
        public string SkillName { get; set; }
    }

    public class EmployeeSkill
    {
        public int Id { get; set; }

        public string EmployeeID { get; set; }
        public Employee Employee { get; set; }

        public string SkillID { get; set; }
        public Skill Skill { get; set; }
    }

}
