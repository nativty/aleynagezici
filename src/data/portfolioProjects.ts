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
// The PDF currently has 2 live projects:
//   - Ulus Savoy P.I  → starts at page 5   (index pages 1-4)
//   - Ulus Savoy P.II → starts at page 16
//
// The sidebar layout mirrors the image:
//   00  MY GALLERY  (intro / index)
//   — interior residential design —
//     01  Ulus Savoy Residence P.I
//     02  Ulus Savoy Residence P.II
//   (future projects go here, currently disabled)
// ─────────────────────────────────────────────────────────────────────────────
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'my-gallery',
    number: '00',
    title: 'MY GALLERY',
    subtitle: 'of design projects',
    type: 'project',
    startPage: 1,
    enabled: true,
  },
  // ── interior residential design ───────────────────────────────
  {
    id: 'ulus-savoy-1',
    number: '01',
    title: 'ULUS SAVOY RESIDENCE',
    subtitle: 'P.I',
    type: 'project',
    startPage: 5,
    enabled: true,
  },
  {
    id: 'ulus-savoy-2',
    number: '02',
    title: 'ULUS SAVOY RESIDENCE',
    subtitle: 'P.II',
    type: 'project',
    startPage: 16,
    enabled: true,
  },
  // ── interior renovation (future) ──────────────────────────────
  {
    id: 'suadiye-house',
    number: '03',
    title: 'SUADIYE HOUSE',
    subtitle: 'P.I',
    type: 'project',
    startPage: 30,
    enabled: false,
  },
  {
    id: 'gumsuyu-house',
    number: '04',
    title: 'GÜMÜŞSUYU HOUSE',
    subtitle: 'P.I',
    type: 'project',
    startPage: 40,
    enabled: false,
  },
  // ── interior office design (future) ───────────────────────────
  {
    id: 'pera-office',
    number: '05',
    title: 'PERA OFFICE PROJECT',
    subtitle: '',
    type: 'project',
    startPage: 50,
    enabled: false,
  },
  // ── freelance projects (future) ───────────────────────────────
  {
    id: 'freelance-1',
    number: '06',
    title: 'FREELANCE PROJECTS',
    subtitle: '',
    type: 'project',
    startPage: 60,
    enabled: false,
  },
];

// Only return enabled projects
export const activeProjects = portfolioProjects.filter(
  (p) => p.type === 'project' && p.enabled
);
