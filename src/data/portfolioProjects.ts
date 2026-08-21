export type ProjectType = 'intro' | 'project';

export interface PortfolioProject {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  type: ProjectType;
  startPage: number;
  enabled: boolean;
}

// Central PDF source – single source of truth for all projects
export const PORTFOLIO_PDF = '/portfolio/projects/01.pdf';

// Resolve a startPage to the left page of the correct spread
// PDF pages are 1-indexed. Odd startPage → it's already left.
// Even startPage → left = startPage - 1.
export function resolveSpread(startPage: number): number {
  if (startPage <= 1) return 1;
  return startPage % 2 !== 0 ? startPage : startPage - 1;
}

// ── Project definitions ──────────────────────────────────────────────────────
// Project start pages are taken from the final portfolio PDF.
// ─────────────────────────────────────────────────────────────────────────────
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'my-gallery',
    number: '00',
    title: 'MY GALLERY',
    subtitle: 'of design projects',
    type: 'project',
    startPage: 2,
    enabled: true,
  },
  // ── interior residential design ───────────────────────────────
  {
    id: 'ulus-savoy-1',
    number: '01',
    title: 'ULUS SAVOY RESIDENCE',
    subtitle: 'P.I',
    type: 'project',
    startPage: 3,
    enabled: true,
  },
  {
    id: 'ulus-savoy-2',
    number: '02',
    title: 'ULUS SAVOY RESIDENCE',
    subtitle: 'P.II',
    type: 'project',
    startPage: 14,
    enabled: true,
  },
  {
    id: 'ulus-apartment-1',
    number: '03',
    title: 'ULUS APARTMENT',
    subtitle: 'P.I',
    type: 'project',
    startPage: 27,
    enabled: true,
  },
  {
    id: 'mesa-house-1',
    number: '04',
    title: 'MESA HOUSE',
    subtitle: 'P.I',
    type: 'project',
    startPage: 35,
    enabled: true,
  },
  {
    id: 'suadiye-house-1',
    number: '05',
    title: 'SUADİYE HOUSE',
    subtitle: 'P.I',
    type: 'project',
    startPage: 49,
    enabled: true,
  },
  {
    id: 'gumussuyu-house-1',
    number: '06',
    title: 'GÜMÜŞSUYU HOUSE',
    subtitle: 'P.I',
    type: 'project',
    startPage: 57,
    enabled: true,
  },
  {
    id: 'pera-office-design-1',
    number: '07',
    title: 'PERA OFFICE DESIGN',
    subtitle: 'P.I',
    type: 'project',
    startPage: 61,
    enabled: true,
  },
];

// Only return enabled projects
export const activeProjects = portfolioProjects.filter(
  (p) => p.type === 'project' && p.enabled
);
