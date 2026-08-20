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

const NAVBAR_H   = 80;
const CONTROLS_H = 76;
const V_PAD      = 48;
const MAX_H_FRAC = 0.70;
// Magnifier size & zoom factor
const LENS_W = 360;
const LENS_H = 260;
const LENS_MAG = 2.2;

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

  // Lens position — only valid while cursor is inside the book
  const [lensPos, setLensPos] = useState<{
    vx: number; vy: number;
    relX: number; relY: number;
  } | null>(null);

  const isMobile = windowSize.w < 900;

  const availH     = Math.min(windowSize.h - NAVBAR_H - CONTROLS_H - V_PAD, windowSize.h * MAX_H_FRAC);
  const stageW     = stageRef.current?.clientWidth ?? windowSize.w - 200;
  const halfW      = stageW / 2;
  const PAGE_ASPECT = 420 / 297; // A3 Landscape
  const hFromW     = halfW / PAGE_ASPECT;
  const pageH      = Math.floor(Math.min(availH, hFromW));
  const pageW      = Math.floor(pageH * PAGE_ASPECT);

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

  // ── Navigation Sync (teleport + 1 animated flip) ─────────────────────────
  const navStateRef = useRef<{ target: number | null; direction: 1 | -1 | 0 }>({ target: null, direction: 0 });

  useEffect(() => {
    if (!flipBookRef.current) return;
    const flipBook = flipBookRef.current.pageFlip();
    const internalPage = flipBook.getCurrentPageIndex();
    if (internalPage === currentPage) return;

    const currentSpread = getSpreadIndex(internalPage);
    const targetSpread  = getSpreadIndex(currentPage);
    const spreadDiff    = Math.abs(targetSpread - currentSpread);

    if (spreadDiff > 1) {
      const direction = targetSpread > currentSpread ? 1 : -1;
      const intermediateSpread = targetSpread - direction;
      const intermediatePage   = Math.max(0, intermediateSpread * 2);
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
        if (direction === 1)  flipBookRef.current?.pageFlip().flipNext();
        else if (direction === -1) flipBookRef.current?.pageFlip().flipPrev();
      }, 50);
    } else if (e.data !== currentPage) {
      onPageChange(e.data);
    }
  }, [currentPage, onPageChange]);

  // ── Reset zoom on page change ─────────────────────────────────────────────
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
  const handleLoadProgress = ({ loaded, total }: { loaded: number; total: number }) => {
    if (total) setLoadProgress(Math.min(100, Math.round((loaded / total) * 100)));
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

  // ── Magnifier: read directly from the already-rendered canvas in the DOM ──
  // This never causes a white flash because we only read what's already painted.
  const magnifierCanvasRef = useRef<HTMLCanvasElement>(null);

  const drawMagnifier = useCallback((relX: number, relY: number) => {
    const canvas = magnifierCanvasRef.current;
    const wrapper = flipbookWrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find all visible PDF canvases inside the flipbook
    const pdfCanvases = wrapper.querySelectorAll<HTMLCanvasElement>("canvas");
    if (pdfCanvases.length === 0) return;

    ctx.clearRect(0, 0, LENS_W, LENS_H);
    ctx.fillStyle = "#F0EDE6";
    ctx.fillRect(0, 0, LENS_W, LENS_H);

    pdfCanvases.forEach((src) => {
      const srcRect = src.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();

      // Position of this canvas relative to wrapper
      const srcX = srcRect.left - wrapRect.left;
      const srcY = srcRect.top  - wrapRect.top;

      // The magnifier zooms around (relX, relY) inside the wrapper
      // Map: dst pixel = (src pixel - focal) * mag + center
      const focalX = relX;
      const focalY = relY;

      // Destination rectangle for this source canvas
      const dstX = (srcX - focalX) * LENS_MAG + LENS_W / 2;
      const dstY = (srcY - focalY) * LENS_MAG + LENS_H / 2;
      const dstW = srcRect.width  * LENS_MAG;
      const dstH = srcRect.height * LENS_MAG;

      try {
        ctx.drawImage(src, dstX, dstY, dstW, dstH);
      } catch {
        // Silently ignore cross-origin or not-yet-painted canvases
      }
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isZoomMode || !flipbookWrapperRef.current) return;
    const rect = flipbookWrapperRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    if (relX < 0 || relX > rect.width || relY < 0 || relY > rect.height) {
      setLensPos(null);
      return;
    }
    const pos = { vx: e.clientX, vy: e.clientY, relX, relY };
    setLensPos(pos);
    drawMagnifier(relX, relY);
  }, [isZoomMode, drawMagnifier]);

  const handleMouseLeave = useCallback(() => {
    setLensPos(null);
  }, []);

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
  const isCover   = visualPage === 0;

  const zoomStyle: React.CSSProperties = {
    transition:      "transform 0.3s ease",
    transformOrigin: "center center",
    transform:       "scale(1)",
    width:  pageW * 2,
    height: pageH,
    ...(isZoomMode ? { cursor: "crosshair" } : {}),
  };

  const renderGlobalLoading = () => (
    <div className="pdf-global-loading">
      <div className="spinner"></div>
      <div className="loading-text">Loading Portfolio… {loadProgress}%</div>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${loadProgress}%` }} />
      </div>
    </div>
  );

  return (
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
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flipbook-depth-left" />
              <div className="flipbook-depth-right" />
              <div className="flipbook-spine" />

              {/* @ts-expect-error - react-pageflip types */}
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
                className={`portfolio-flipbook${isZoomMode ? " no-pointer-events" : ""}`}
                ref={flipBookRef}
                drawShadow={true}
                flippingTime={950}
                maxShadowOpacity={0.4}
                clickEventForward={false}
                useMouseEvents={!isZoomMode}
              >
                <BookPage key="cover" number={0} pageW={pageW} pageH={pageH}>
                  {renderCover()}
                </BookPage>

                {Array.from({ length: numPages }).map((_, i) => {
                  const pageNum     = i + 1;
                  const shouldRender =
                    Math.abs(pageNum - visualPage) <= 4 ||
                    (navStateRef.current.target !== null &&
                      Math.abs(pageNum - navStateRef.current.target) <= 1);

                  return (
                    <BookPage key={`p-${pageNum}`} number={pageNum} pageW={pageW} pageH={pageH}>
                      {shouldRender ? (
                        <Page
                          pageNumber={pageNum}
                          height={pageH}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={
                            <div className="page-paper-placeholder" style={{ width: pageW, height: pageH }} />
                          }
                        />
                      ) : (
                        <div className="page-paper-placeholder" style={{ width: pageW, height: pageH }} />
                      )}
                    </BookPage>
                  );
                })}
              </HTMLFlipBook>
              {/* Event blocker overlay for zoom mode - stops react-pageflip from curling pages */}
              {isZoomMode && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 200,
                    cursor: "crosshair",
                  }}
                />
              )}
            </div>
          )}
        </Document>
      </div>

      {/* ── Magnifier overlay — canvas reads DOM directly, no PDF re-render ── */}
      {isZoomMode && lensPos && (
        <canvas
          ref={magnifierCanvasRef}
          width={LENS_W}
          height={LENS_H}
          className="magnifier-lens"
          style={{
            position: "fixed",
            left: lensPos.vx - LENS_W / 2,
            top:  lensPos.vy - LENS_H / 2,
            width:  LENS_W,
            height: LENS_H,
            pointerEvents: "none",
            zIndex: 250,
          }}
        />
      )}

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
  );
}
