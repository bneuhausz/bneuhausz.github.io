export interface Tech {
  name: string;
  secondary?: boolean;
}

export const techStack: Tech[] = [
  { name: 'Angular' },
  { name: 'ASP.NET Core' },
  { name: 'Node.js' },
  { name: 'PostgreSQL' },
  { name: 'SQL Server' },
  { name: 'Flutter', secondary: true },
  { name: 'Redis', secondary: true },
  { name: 'OPC UA', secondary: true },
  { name: 'SAP', secondary: true },
  { name: 'AMQP', secondary: true },
];
