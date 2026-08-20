import React, { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import BookControls from "./BookControls";
import "./BookViewer.css";

// @ts-ignore
import HTMLFlipBook from "react-pageflip";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface BookViewerProps {
  file: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDocumentLoadSuccess: (numPages: number) => void;
  numPages: number;
}

const NAVBAR_H    = 80;
const CONTROLS_H  = 76;
const V_PAD       = 48;
const MAX_H_FRAC  = 0.70;
const LENS_DIAMETER = 320;
const LENS_MAG      = 2.5;

const getSpreadIndex = (p: number) => p <= 0 ? 0 : Math.ceil(p / 2);

interface BookPageProps {
  number: number;
  children: React.ReactNode;
  pageW: number;
  pageH: number;
}

const BookPage = React.forwardRef<HTMLDivElement, BookPageProps>((props, ref) => (
  <div
    className="book-page-slot"
    ref={ref}
    style={{ width: props.pageW, height: props.pageH }}
  >
    {props.children}
  </div>
));
BookPage.displayName = "BookPage";

export default function BookViewer({
  file,
  currentPage,
  onPageChange,
  onDocumentLoadSuccess,
  numPages,
}: BookViewerProps) {
  const stageRef           = useRef<HTMLDivElement>(null);
  const flipBookRef        = useRef<any>(null);
  const flipbookWrapperRef = useRef<HTMLDivElement>(null);

  const [windowSize, setWindowSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth  : 1400,
    h: typeof window !== "undefined" ? window.innerHeight : 900,
  });
  
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [visualPage, setVisualPage] = useState(currentPage);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const [lensPos, setLensPos] = useState<{
    vx: number; vy: number; pctX: number; pctY: number;
  } | null>(null);

  const lastLensPosRef = useRef<{ vx: number; vy: number; pctX: number; pctY: number }>({ vx: 0, vy: 0, pctX: 0.5, pctY: 0.5 });
  if (lensPos) {
    lastLensPosRef.current = lensPos;
  }

  const isMobile = windowSize.w < 900;

  const availH    = Math.min(windowSize.h - NAVBAR_H - CONTROLS_H - V_PAD, windowSize.h * MAX_H_FRAC);
  const stageW    = stageRef.current?.clientWidth ?? windowSize.w - 200;
  const halfW     = stageW / 2;
  const PAGE_ASPECT = 420 / 297; // A3 Landscape Aspect Ratio
  const hFromW    = halfW / PAGE_ASPECT;
  const pageH     = Math.floor(Math.min(availH, hFromW));
  const pageW     = Math.floor(pageH * PAGE_ASPECT);

  const MAX_DEPTH    = 18;
  const MIN_DEPTH    = 2;
  const progress     = numPages > 1 ? Math.min(1, Math.max(0, currentPage / numPages)) : 0;
  const leftDepthPx  = MIN_DEPTH + (MAX_DEPTH - MIN_DEPTH) * progress;
  const rightDepthPx = MAX_DEPTH - (MAX_DEPTH - MIN_DEPTH) * progress;

  useEffect(() => {
    const fn = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // ── Smart Navigation Sync (1 Animated Flip) ───────────────────────────────
  const navStateRef = useRef<{ target: number | null, direction: 1 | -1 | 0 }>({ target: null, direction: 0 });

  useEffect(() => {
    if (!flipBookRef.current) return;
    const flipBook = flipBookRef.current.pageFlip();
    const internalPage = flipBook.getCurrentPageIndex();
    
    if (internalPage === currentPage) return;

    const currentSpread = getSpreadIndex(internalPage);
    const targetSpread = getSpreadIndex(currentPage);
    const spreadDiff = Math.abs(targetSpread - currentSpread);

    if (spreadDiff > 1) {
      const direction = targetSpread > currentSpread ? 1 : -1;
      const intermediateSpread = targetSpread - direction;
      const intermediatePage = intermediateSpread * 2;
      
      navStateRef.current = { target: currentPage, direction };
      flipBook.turnToPage(intermediatePage);
    } else {
      if (targetSpread > currentSpread) flipBook.flipNext();
      else if (targetSpread < currentSpread) flipBook.flipPrev();
    }
  }, [currentPage]);

  const onFlip = useCallback((e: { data: number }) => {
    setVisualPage(e.data);
    
    if (navStateRef.current.target !== null) {
      const { direction } = navStateRef.current;
      navStateRef.current = { target: null, direction: 0 };
      
      setTimeout(() => {
        if (direction === 1) flipBookRef.current?.pageFlip().flipNext();
        else if (direction === -1) flipBookRef.current?.pageFlip().flipPrev();
      }, 50);
    } else if (e.data !== currentPage) {
      onPageChange(e.data);
    }
  }, [currentPage, onPageChange]);

  // ── Reset on page change ──
  useEffect(() => {
    setIsZoomMode(false);
    setLensPos(null);
  }, [currentPage]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setIsZoomMode(false); setLensPos(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLoadSuccess = ({ numPages: n }: { numPages: number }) => {
    onDocumentLoadSuccess(n);
  };

  const handleLoadProgress = ({ loaded, total }: { loaded: number, total: number }) => {
    if (total) {
      setLoadProgress(Math.min(100, Math.round((loaded / total) * 100)));
    }
  };

  const goNext = () => {
    if (!isZoomMode && navStateRef.current.target === null) flipBookRef.current?.pageFlip().flipNext();
  };
  const goPrev = () => {
    if (!isZoomMode && navStateRef.current.target === null) flipBookRef.current?.pageFlip().flipPrev();
  };

  const toggleZoom = useCallback(() => {
    setIsZoomMode(prev => !prev);
    setLensPos(null);
  }, []);

  const handleOverlayMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isZoomMode || !flipbookWrapperRef.current) return;
    const rect = flipbookWrapperRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    
    if (relX < 0 || relX > rect.width || relY < 0 || relY > rect.height) {
      setLensPos(null);
      return;
    }
    
    setLensPos({
      vx: e.clientX,
      vy: e.clientY,
      pctX: relX / rect.width,
      pctY: Math.max(0, Math.min(1, relY / rect.height)),
    });
  }, [isZoomMode]);

  const renderMagnifier = (): React.ReactNode => {
    if (numPages === 0 || !isZoomMode) return null;

    const pos = lensPos || lastLensPosRef.current;
    const isVisible = lensPos !== null;

    const leftPageNum = visualPage === 0 ? 0 : (visualPage % 2 !== 0 ? visualPage : visualPage - 1);
    const rightPageNum = leftPageNum + 1;

    const totalW = pageW * 2 * LENS_MAG;
    const totalH = pageH * LENS_MAG;
    
    const offsetX = -(pos.pctX * totalW - LENS_DIAMETER / 2);
    const offsetY = -(pos.pctY * totalH - LENS_DIAMETER / 2);

    return (
      <div
        className="magnifier-lens"
        style={{
          position: "fixed",
          left: pos.vx - LENS_DIAMETER / 2,
          top:  pos.vy - LENS_DIAMETER / 2,
          width:  LENS_DIAMETER,
          height: LENS_DIAMETER,
          zIndex: 250,
          pointerEvents: "none",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <div style={{ position: "absolute", left: offsetX, top: offsetY, width: totalW, height: totalH, display: 'flex' }}>
          <div style={{ width: totalW / 2, height: totalH, background: "#F0EDE6", position: 'relative' }}>
            {leftPageNum > 0 && leftPageNum <= numPages && (
              <Page
                pageNumber={leftPageNum}
                height={totalH}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                devicePixelRatio={1.2} // Cap resolution inside magnifier to prevent freezing
                loading={<div style={{ width: '100%', height: '100%', background: "#F0EDE6" }} />}
              />
            )}
          </div>
          <div style={{ width: totalW / 2, height: totalH, background: "#F0EDE6", position: 'relative' }}>
            {rightPageNum > 0 && rightPageNum <= numPages && (
              <Page
                pageNumber={rightPageNum}
                height={totalH}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                devicePixelRatio={1.2}
                loading={<div style={{ width: '100%', height: '100%', background: "#F0EDE6" }} />}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCover = () => (
    <div className="book-virtual-cover" style={{ width: pageW, height: pageH }}>
      <div className="book-virtual-cover-inner">
        <span>INTERIOR ARCHITECT</span>
        <div className="book-title">PORTFOLIO</div>
        <div className="book-logo">ag</div>
      </div>
    </div>
  );

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < numPages;

  let zoomStyle: React.CSSProperties = {
    transition:      "transform 0.3s ease",
    transformOrigin: "center center",
    transform:       "scale(1) translateX(0)",
    width:  pageW * 2,
    height: pageH,
  };
  
  if (isZoomMode) {
    const scale  = Math.min(
      (windowSize.h * 0.88) / pageH,
      (windowSize.w * 0.82) / (pageW * 2)
    );
    zoomStyle = {
      ...zoomStyle,
      transform: `scale(${scale > 1.05 ? 1.05 : scale})`,
      zIndex: 100,
      cursor: 'crosshair'
    };
  }

  const isCover = visualPage === 0;

  const renderGlobalLoading = () => (
    <div className="pdf-global-loading">
      <div className="spinner"></div>
      <div className="loading-text">Portfolio Yükleniyor... %{loadProgress}</div>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${loadProgress}%` }} />
      </div>
    </div>
  );

  return (
    <>
      <div className="book-viewer">
        <div className="book-stage" ref={stageRef}>
          <Document
            file={file}
            onLoadSuccess={handleLoadSuccess}
            onLoadProgress={handleLoadProgress}
            className="pdf-doc-global"
            loading={renderGlobalLoading()}
            error={<div className="pdf-global-error">PDF could not be loaded.</div>}
          >
            {numPages > 0 && (
              <div
                ref={flipbookWrapperRef}
                className={`flipbook-wrapper${isZoomMode ? " is-zoomed" : ""}${isCover ? " is-cover" : ""}`}
                style={{
                  "--left-depth":  `${leftDepthPx}px`,
                  "--right-depth": `${rightDepthPx}px`,
                  ...zoomStyle,
                } as React.CSSProperties}
                onMouseMove={handleOverlayMouseMove}
                onMouseLeave={() => setLensPos(null)}
              >
                <div className="flipbook-depth-left" />
                <div className="flipbook-depth-right" />
                <div className="flipbook-spine" />

                {/* @ts-expect-error - react-pageflip types are outdated */}
                <HTMLFlipBook
                  width={pageW}
                  height={pageH}
                  size="fixed"
                  minWidth={pageW}
                  maxWidth={pageW}
                  minHeight={pageH}
                  maxHeight={pageH}
                  showCover={true}
                  usePortrait={isMobile}
                  onFlip={onFlip}
                  className={`portfolio-flipbook ${isZoomMode ? 'no-pointer-events' : ''}`}
                  ref={flipBookRef}
                  drawShadow={true}
                  flippingTime={950}
                  maxShadowOpacity={0.4}
                  clickEventForward={false}
                  useMouseEvents={true}
                >
                  <BookPage
                    key="cover"
                    number={0}
                    pageW={pageW}
                    pageH={pageH}
                  >
                    {renderCover()}
                  </BookPage>

                  {Array.from({ length: numPages }).map((_, i) => {
                    const pageNum      = i + 1;
                    // Strict threshold to maximize performance and prevent white flashes
                    const shouldRender = 
                      Math.abs(pageNum - visualPage) <= 2 || 
                      (navStateRef.current.target !== null && Math.abs(pageNum - navStateRef.current.target) <= 1);

                    return (
                      <BookPage
                        key={`p-${pageNum}`}
                        number={pageNum}
                        pageW={pageW}
                        pageH={pageH}
                      >
                        {shouldRender ? (
                          <Page
                            pageNumber={pageNum}
                            height={pageH}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            devicePixelRatio={1.5} // High quality but capped to prevent freezing
                            loading={
                              <div
                                className="page-paper-placeholder"
                                style={{ width: pageW, height: pageH }}
                              />
                            }
                          />
                        ) : (
                          <div
                            className="page-paper-placeholder"
                            style={{ width: pageW, height: pageH }}
                          />
                        )}
                      </BookPage>
                    );
                  })}
                </HTMLFlipBook>
              </div>
            )}

            {renderMagnifier()}
          </Document>
        </div>

        <div className="book-controls-row">
          <BookControls
            currentPage={currentPage}
            numPages={numPages}
            onPrev={goPrev}
            onNext={goNext}
            canPrev={canGoPrev}
            canNext={canGoNext}
            isZoomMode={isZoomMode}
            onToggleZoom={toggleZoom}
          />
        </div>
      </div>
    </>
  );
}
