import { useEffect, useRef, useState } from 'react';
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
  isBackCover: boolean;
  isGeneratedPage: boolean;
  isMobile: boolean;
  onGoToPage: (page: number) => void;
}

export default function BookControls({ currentPage, numPages, onPrev, onNext, canPrev, canNext, isZoomMode, onToggleZoom, isBackCover, isGeneratedPage, isMobile, onGoToPage }: BookControlsProps) {
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageDraft, setPageDraft] = useState('');
  const pageInputRef = useRef<HTMLInputElement>(null);

  const isPdfPage = currentPage >= 1 && currentPage <= numPages;
  const displayedPage = isMobile || currentPage % 2 !== 0 ? currentPage : currentPage - 1;

  useEffect(() => {
    if (!isEditingPage) return;
    pageInputRef.current?.focus();
    pageInputRef.current?.select();
  }, [isEditingPage]);

  const beginPageEdit = () => {
    if (!isPdfPage) return;
    setPageDraft(String(displayedPage));
    setIsEditingPage(true);
  };

  const cancelPageEdit = () => {
    setPageDraft(String(displayedPage));
    setIsEditingPage(false);
  };

  const submitPageEdit = () => {
    const requestedPage = Number(pageDraft);
    setIsEditingPage(false);

    // Invalid values never reach the flipbook. Returning to the current label
    // prevents an out-of-range page from leaving the reader in a broken state.
    if (!Number.isInteger(requestedPage) || requestedPage < 1 || requestedPage > numPages) {
      setPageDraft(String(displayedPage));
      return;
    }

    onGoToPage(requestedPage);
  };

  // Spread label: "1–2 / 27", "3–4 / 27", etc.
  const spreadLabel = () => {
    if (currentPage === 0)          return 'PORTFOLIO';
    if (numPages === 0)             return `${currentPage}`;
    if (isBackCover)                return 'BACK COVER';
    if (isMobile)                   return `${currentPage} / ${numPages}`;
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
        {isEditingPage ? (
          <input
            ref={pageInputRef}
            className="book-page-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pageDraft}
            onChange={(event) => setPageDraft(event.target.value)}
            onBlur={cancelPageEdit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitPageEdit();
              if (event.key === 'Escape') cancelPageEdit();
            }}
            aria-label={`Go to PDF page, from 1 to ${numPages}`}
          />
        ) : (
          <button
            type="button"
            className={`book-page-indicator${isPdfPage ? ' is-editable' : ''}`}
            onClick={beginPageEdit}
            disabled={!isPdfPage}
            aria-label={isPdfPage ? `Current page ${displayedPage}. Select to go to another page.` : undefined}
          >
            {spreadLabel()}
          </button>
        )}
        <button 
          className={`book-btn zoom-btn ${isZoomMode ? 'active' : ''}`}
          onClick={onToggleZoom}
          disabled={isGeneratedPage}
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
