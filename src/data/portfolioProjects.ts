export type ProjectType = 'intro' | 'project';

export interface PortfolioProject {
  id: string;
  number: string;
  title: string;
  type: ProjectType;
  startPage: number;
  enabled: boolean;
}

// Central PDF source — single source of truth for all projects
export const PORTFOLIO_PDF = '/portfolio/projects/01.pdf';

// Resolve a startPage to the left page of the correct spread
// PDF pages are 1-indexed. Odd startPage → it's already left.
// Even startPage → left = startPage - 1.
export function resolveSpread(startPage: number): number {
  if (startPage <= 1) return 1;
  return startPage % 2 !== 0 ? startPage : startPage - 1;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'my-gallery',
    number: '00',
    title: 'MY GALLERY',
    type: 'project',
    startPage: 1,
    enabled: true,
  },
  {
    id: 'project-1',
    number: '01',
    title: 'BEBEK PENTHOUSE',
    type: 'project',
    startPage: 3,
    enabled: true,
  },
  {
    id: 'project-2',
    number: '02',
    title: 'KADIKÖY RESIDENCE',
    type: 'project',
    startPage: 8,
    enabled: true,
  },
  {
    id: 'project-3',
    number: '03',
    title: 'BODRUM VILLA',
    type: 'project',
    startPage: 15,
    enabled: false,
  },
  {
    id: 'project-4',
    number: '04',
    title: 'OFFICE PROJECT',
    type: 'project',
    startPage: 22,
    enabled: false,
  },
];

// Only return enabled projects (excludes intros if there were any)
export const activeProjects = portfolioProjects.filter(
  (p) => p.type === 'project' && p.enabled
);
