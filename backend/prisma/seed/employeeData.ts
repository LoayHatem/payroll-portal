import { faker } from "@faker-js/faker";
interface Employee {
  name: string;
  email: string;
  position: string;
  joiningDate: Date | null;
  salary: number;
  allowances: {
    housing: number;
    transportation: number;
    food: number;
    utility: number;
    communication: number;
  };
}

const positions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Analyst",
  "HR Manager",
  "Marketing Specialist",
  "Sales Representative",
  "Customer Support Representative",
  "Financial Analyst",
  "Project Manager",
  "Business Analyst",
  "Quality Assurance Engineer",
  "DevOps Engineer",
  "System Administrator",
  "Network Engineer",
  "Database Administrator",
  "Cloud Architect",
  "AI/ML Engineer",
  "Cybersecurity Specialist",
  "Content Writer",
  "Graphic Designer",
  "SEO Specialist",
  "Social Media Manager",
  "Account Manager",
  "Operations Manager",
  "Legal Counsel",
  "Compliance Officer",
  "Supply Chain Manager",
  "Logistics Coordinator",
];

const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Emily",
  "David",
  "Sarah",
  "Mohammed",
  "Fatima",
  "Ali",
  "Aisha",
  "Robert",
  "Maria",
  "William",
  "Elizabeth",
  "James",
  "Patricia",
  "Thomas",
  "Jennifer",
  "Charles",
  "Linda",
  "Daniel",
  "Barbara",
  "Paul",
  "Margaret",
  "Mark",
  "Susan",
  "Donald",
  "Dorothy",
  "George",
  "Lisa",
  "Kenneth",
  "Nancy",
  "Steven",
  "Karen",
  "Edward",
  "Betty",
  "Brian",
  "Helen",
  "Ronald",
  "Sandra",
  "Anthony",
  "Donna",
  "Kevin",
  "Carol",
  "Jason",
  "Ruth",
  "Jeffrey",
  "Sharon",
  "Ryan",
  "Michelle",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Brown",
  "Lee",
  "Wang",
  "Garcia",
  "Kumar",
  "Patel",
  "Al-Sayed",
  "Nguyen",
  "Williams",
  "Jones",
  "Miller",
  "Davis",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Jackson",
  "Martin",
  "Thompson",
  "White",
  "Lopez",
  "Harris",
  "Clark",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Hall",
  "Allen",
  "Wright",
  "King",
  "Scott",
  "Green",
  "Baker",
  "Adams",
  "Nelson",
  "Hill",
  "Ramirez",
  "Campbell",
  "Mitchell",
  "Roberts",
  "Carter",
  "Phillips",
  "Evans",
  "Turner",
  "Torres",
  "Parker",
];

const generateName = (): string => {
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const generateEmail = (name: string): string => {
  const [firstName, lastName] = name.toLowerCase().split(" ");
  return `${firstName}.${lastName}@company.com`;
};

const generateSalary = (position: string): number => {
  const baseSalaries: { [key: string]: number } = {
    "Software Engineer": 8000,
    "Senior Software Engineer": 12000,
    "Product Manager": 10000,
    "UX Designer": 7500,
    "Data Analyst": 7000,
    "HR Manager": 9000,
    "Marketing Specialist": 6500,
    "Sales Representative": 6000,
    "Customer Support Representative": 5500,
    "Financial Analyst": 8500,
    "Project Manager": 11000,
    "Business Analyst": 8000,
    "Quality Assurance Engineer": 7500,
    "DevOps Engineer": 10000,
    "System Administrator": 8000,
    "Network Engineer": 8500,
    "Database Administrator": 9000,
    "Cloud Architect": 12000,
    "AI/ML Engineer": 11000,
    "Cybersecurity Specialist": 10000,
    "Content Writer": 5500,
    "Graphic Designer": 6000,
    "SEO Specialist": 6500,
    "Social Media Manager": 6000,
    "Account Manager": 7500,
    "Operations Manager": 9500,
    "Legal Counsel": 11000,
    "Compliance Officer": 9000,
    "Supply Chain Manager": 9000,
    "Logistics Coordinator": 7000,
  };

  const baseSalary = baseSalaries[position] || 6000;
  return baseSalary + Math.floor(Math.random() * 2000); // Add some variation
};

const generateAllowances = (salary: number): Employee["allowances"] => {
  return {
    housing: Math.round(salary * 0.25),
    transportation: Math.round(salary * 0.1),
    food: Math.round(salary * 0.05),
    utility: Math.round(salary * 0.05),
    communication: Math.round(salary * 0.03),
  };
};

const generateJoiningDate = () => {
  return faker.date.between({ from: "2018-01-01", to: "2023-01-01" });
};

export const generateEmployees = (count: number): Employee[] => {
  const employees: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const position = positions[Math.floor(Math.random() * positions.length)];
    const name = generateName();
    const salary = generateSalary(position);

    employees.push({
      name,
      email: generateEmail(name),
      position,
      joiningDate: generateJoiningDate(),
      salary,
      allowances: generateAllowances(salary),
    });
  }

  return employees;
};
