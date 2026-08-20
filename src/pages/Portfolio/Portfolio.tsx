import { useState } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import BookViewer from '../../components/portfolio/BookViewer';
import ProjectIndex from '../../components/portfolio/ProjectIndex';
import {
  portfolioProjects,
  PORTFOLIO_PDF,
  resolveSpread,
  activeProjects,
} from '../../data/portfolioProjects';
import './Portfolio.css';

export default function Portfolio() {
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover
  const [numPages, setNumPages] = useState<number>(0);

  // Determine active project: find the last project whose spread-start ≤ current page.
  // We use resolveSpread(p.startPage) so that a project starting on an even page (e.g. 8)
  // is correctly identified when currentPage is the left page of that spread (e.g. 7).
  const resolveActiveProject = (): string => {
    if (currentPage <= 0) return activeProjects[0]?.id ?? '';
    const sorted = [...activeProjects].sort((a, b) => b.startPage - a.startPage);
    const found = sorted.find((p) => resolveSpread(p.startPage) <= currentPage);
    return found?.id ?? sorted[sorted.length - 1]?.id ?? '';
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleProjectSelect = (projectId: string) => {
    const proj = portfolioProjects.find((p) => p.id === projectId);
    if (proj && proj.enabled && proj.type === 'project') {
      // Navigate to the correct left-page of the spread
      const targetLeft = resolveSpread(proj.startPage);
      setCurrentPage(targetLeft);
    }
  };

  return (
    <main className="portfolio">
      <PageContainer className="portfolio-container">
        <div className="portfolio-layout">
          <div className="portfolio-viewer-area">
            <BookViewer
              file={PORTFOLIO_PDF}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onDocumentLoadSuccess={(n) => setNumPages(n)}
              numPages={numPages}
            />
          </div>

          <div className="portfolio-index-area">
            <ProjectIndex
              projects={activeProjects}
              activeProjectId={resolveActiveProject()}
              onSelect={handleProjectSelect}
            />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
