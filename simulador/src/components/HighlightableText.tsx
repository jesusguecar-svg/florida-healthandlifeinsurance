import { useCallback, useImperativeHandle, useRef, forwardRef } from 'react';

export interface HighlightableTextHandle {
  /** Returns the character range of the current selection inside this node. */
  getSelectionRange: () => [number, number] | null;
}

interface Props {
  text: string;
  highlights: [number, number][];
  className?: string;
}

/** Merges overlapping ranges and returns them ordered. */
function normalizeRanges(ranges: [number, number][]): [number, number][] {
  const sorted = [...ranges]
    .map(([a, b]) => [Math.min(a, b), Math.max(a, b)] as [number, number])
    .filter(([a, b]) => b > a)
    .sort((x, y) => x[0] - y[0]);
  const out: [number, number][] = [];
  for (const range of sorted) {
    const last = out[out.length - 1];
    if (last && range[0] <= last[1]) {
      last[1] = Math.max(last[1], range[1]);
    } else {
      out.push([...range] as [number, number]);
    }
  }
  return out;
}

function offsetWithin(root: Node, node: Node, offset: number): number | null {
  if (node === root) {
    // The boundary points at an element: count the text of its earlier children.
    let total = 0;
    for (let i = 0; i < offset && i < root.childNodes.length; i++) {
      total += root.childNodes[i].textContent?.length ?? 0;
    }
    return total;
  }
  let total = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    if (current === node) return total + offset;
    total += current.textContent?.length ?? 0;
    current = walker.nextNode();
  }
  return null;
}

/**
 * Resolves a selection boundary that may sit outside the highlighted node —
 * a triple click, for instance, anchors on the surrounding paragraph.
 */
function clampBoundary(
  root: HTMLElement,
  node: Node,
  offset: number,
  fallbackToEnd: boolean,
): number {
  const inside = offsetWithin(root, node, offset);
  if (inside !== null) return inside;
  const length = root.textContent?.length ?? 0;
  try {
    const point = document.createRange();
    point.setStart(node, offset);
    const contents = document.createRange();
    contents.selectNodeContents(root);
    return point.compareBoundaryPoints(Range.START_TO_START, contents) <= 0 ? 0 : length;
  } catch {
    return fallbackToEnd ? length : 0;
  }
}

export const HighlightableText = forwardRef<HighlightableTextHandle, Props>(
  function HighlightableText({ text, highlights, className }, ref) {
    const containerRef = useRef<HTMLSpanElement>(null);

    const getSelectionRange = useCallback((): [number, number] | null => {
      const container = containerRef.current;
      const selection = window.getSelection();
      if (!container || !selection || selection.rangeCount === 0) return null;
      const range = selection.getRangeAt(0);
      if (range.collapsed) return null;
      if (!range.intersectsNode(container)) return null;
      const start = clampBoundary(container, range.startContainer, range.startOffset, false);
      const end = clampBoundary(container, range.endContainer, range.endOffset, true);
      if (start === end) return null;
      selection.removeAllRanges();
      return [Math.min(start, end), Math.max(start, end)];
    }, []);

    useImperativeHandle(ref, () => ({ getSelectionRange }), [getSelectionRange]);

    const ranges = normalizeRanges(highlights);
    const parts: { text: string; marked: boolean }[] = [];
    let cursor = 0;
    for (const [start, end] of ranges) {
      const from = Math.max(0, Math.min(start, text.length));
      const to = Math.max(0, Math.min(end, text.length));
      if (from > cursor) parts.push({ text: text.slice(cursor, from), marked: false });
      if (to > from) parts.push({ text: text.slice(from, to), marked: true });
      cursor = Math.max(cursor, to);
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor), marked: false });

    return (
      <span ref={containerRef} className={className}>
        {parts.map((part, index) =>
          part.marked ? (
            <mark key={index} className="marcado">
              {part.text}
            </mark>
          ) : (
            <span key={index}>{part.text}</span>
          ),
        )}
      </span>
    );
  },
);
