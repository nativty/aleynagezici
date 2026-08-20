import './BookViewer.css';

interface BookControlsProps {
  currentPage: number;
  numPages: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  isZoomMode: boolean;
  onToggleZoom: () => void;
}

export default function BookControls({ currentPage, numPages, onPrev, onNext, canPrev, canNext, isZoomMode, onToggleZoom }: BookControlsProps) {
  // Spread label: "1–2 / 27", "3–4 / 27", etc.
  const spreadLabel = () => {
    if (currentPage === 0)          return 'PORTFOLIO';
    if (numPages === 0)             return `${currentPage}`;
    const left  = currentPage % 2 !== 0 ? currentPage : currentPage - 1;
    const right = left + 1 <= numPages ? left + 1 : null;
    const range = right ? `${left}–${right}` : `${left}`;
    return `${range} / ${numPages}`;
  };

  return (
    <div className="book-controls">
      <button className="book-btn" onClick={onPrev} disabled={!canPrev} aria-label="Previous spread">
        ← PREV
      </button>

      <div className="book-center-controls">
        <div className="book-page-indicator">{spreadLabel()}</div>
        <button 
          className={`book-btn zoom-btn ${isZoomMode ? 'active' : ''}`}
          onClick={onToggleZoom}
          title="Magnifier"
          aria-label="Magnifier"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginTop: '-2px'}}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
      </div>

      <button className="book-btn" onClick={onNext} disabled={!canNext} aria-label="Next spread">
        NEXT →
      </button>
    </div>
  );
}
