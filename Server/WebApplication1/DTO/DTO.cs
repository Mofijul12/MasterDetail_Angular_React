namespace WebApplication1.DTO
{
    public class EmployeeDto
    {
        public string EmployeeID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public List<string> SkillIDs { get; set; }
    }

    public class SkillDto
    {
        public string SkillID { get; set; }
        public string SkillName { get; set; }
    }

    public class EmployeeViewDto
    {
        public string EmployeeID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public List<string> Skills { get; set; }
    }

}
