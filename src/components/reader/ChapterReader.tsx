"use client";

import React from "react";
import { speakKorean } from "@/lib/tts";

interface Props {
  content: string;
  chapterId: string;
  showRomanization?: boolean;
  ttsRate?: number;
  fontSize?: "sm" | "base" | "lg" | "xl";
}

// ─── TTS helper ──────────────────────────────────────────────────────────────
function speak(text: string, rate = 0.85) {
  speakKorean(text, { rate });
}

// ─── Inline text renderer (bold / italic) ───────────────────────────────────
function renderInline(text: string): React.ReactNode {
  if (!text) return null;
  const boldParts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {boldParts.map((seg, bi) => {
        if (bi % 2 === 1) {
          return (
            <strong key={bi} className="font-semibold text-white">
              {seg}
            </strong>
          );
        }
        const italicParts = seg.split(/\*(.+?)\*/g);
        return (
          <React.Fragment key={bi}>
            {italicParts.map((iSeg, ii) =>
              ii % 2 === 1 ? (
                <em key={ii} className="italic text-[#8892B0]">
                  {iSeg}
                </em>
              ) : (
                iSeg || null
              )
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

// ─── Block types ─────────────────────────────────────────────────────────────
type BlockquoteFlavor = "tip" | "warning" | "conversation" | "culture" | "default";

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "hr" }
  | { type: "blockquote"; lines: string[]; flavor: BlockquoteFlavor }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "paragraph"; text: string };

// ─── Markdown → Block parser ─────────────────────────────────────────────────
function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") { i++; continue; }

    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", text: trimmed.slice(2) });
      i++;
    } else if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3) });
      i++;
    } else if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4) });
      i++;
    } else if (trimmed === "---") {
      blocks.push({ type: "hr" });
      i++;
    } else if (trimmed.startsWith("> ")) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        bqLines.push(lines[i].trim().slice(2));
        i++;
      }
      const allText = bqLines.join(" ");
      let flavor: BlockquoteFlavor = "default";
      if (allText.includes("🌏")) flavor = "culture";
      else if (allText.includes("💡")) flavor = "tip";
      else if (allText.includes("⚠️")) flavor = "warning";
      else if (bqLines.some((l) => l.match(/^\*?\*?[AB]:?\*?\*?\s/))) flavor = "conversation";
      blocks.push({ type: "blockquote", lines: bqLines, flavor });
    } else if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0]
          .split("|").map((s) => s.trim()).filter(Boolean);
        const rows = tableLines.slice(2).map((row) =>
          row.split("|").map((s) => s.trim()).filter(Boolean)
        );
        blocks.push({ type: "table", headers, rows });
      }
    } else if (trimmed.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-*] /)) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
    } else if (trimmed.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\. /)) {
        items.push(lines[i].trim().replace(/^\d+\. /, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
    } else {
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].trim().startsWith("#") &&
        !lines[i].trim().startsWith("> ") &&
        !lines[i].trim().startsWith("|") &&
        !lines[i].trim().match(/^[-*] /) &&
        !lines[i].trim().match(/^\d+\. /) &&
        lines[i].trim() !== "---"
      ) {
        paraLines.push(lines[i].trim());
        i++;
      }
      if (paraLines.length > 0) {
        blocks.push({ type: "paragraph", text: paraLines.join(" ") });
      }
    }
  }

  return blocks;
}

// ─── Blockquote renderers ────────────────────────────────────────────────────
function TipBox({ lines }: { lines: string[] }) {
  return (
    <div className="my-6 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-2xl p-5 flex gap-3">
      <span className="text-xl shrink-0 mt-0.5">💡</span>
      <div className="text-sm text-[#F0F4FF] leading-relaxed space-y-1">
        {lines.map((line, li) => (
          <p key={li}>{renderInline(line.replace(/^💡\s*/, ""))}</p>
        ))}
      </div>
    </div>
  );
}

function WarningBox({ lines }: { lines: string[] }) {
  return (
    <div className="my-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 flex gap-3">
      <span className="text-xl shrink-0 mt-0.5">⚠️</span>
      <div className="text-sm text-[#F0F4FF] leading-relaxed space-y-1">
        {lines.map((line, li) => (
          <p key={li}>{renderInline(line.replace(/^⚠️\s*/, ""))}</p>
        ))}
      </div>
    </div>
  );
}

function CultureNote({ lines }: { lines: string[] }) {
  return (
    <div className="my-6 bg-purple-500/10 border border-purple-400/30 rounded-2xl overflow-hidden">
      <div className="bg-purple-500/15 px-4 py-2 flex items-center gap-2">
        <span className="text-base">🌏</span>
        <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
          Culture Note
        </span>
      </div>
      <div className="px-5 py-4 space-y-1.5">
        {lines.map((line, li) => (
          <p key={li} className="text-sm text-[#C0C8D8] leading-relaxed">
            {renderInline(line.replace(/^🌏\s*/, ""))}
          </p>
        ))}
      </div>
    </div>
  );
}

function ConversationBox({ lines }: { lines: string[] }) {
  return (
    <div className="my-6 bg-[#4F7FE8]/10 rounded-2xl overflow-hidden border border-[#4F7FE8]/20">
      <div className="bg-[#4F7FE8]/15 px-4 py-2">
        <span className="text-xs font-semibold text-[#4F7FE8] uppercase tracking-wider">
          💬 Conversation Practice
        </span>
      </div>
      <div className="px-5 py-4 space-y-2">
        {lines.map((line, li) => (
          <p key={li} className="text-sm text-[#C0C8D8] leading-relaxed">
            {renderInline(line)}
          </p>
        ))}
      </div>
    </div>
  );
}

function DefaultBlockquote({ lines }: { lines: string[] }) {
  return (
    <div className="my-5 border-l-4 border-[#4F7FE8] bg-[#4F7FE8]/5 rounded-r-xl pl-4 pr-4 py-3">
      {lines.map((line, li) => (
        <p key={li} className="text-sm text-[#8892B0] leading-relaxed">
          {renderInline(line)}
        </p>
      ))}
    </div>
  );
}

// ─── Table renderer ──────────────────────────────────────────────────────────
function TableBlock({
  headers,
  rows,
  showRomanization,
  ttsRate,
}: {
  headers: string[];
  rows: string[][];
  showRomanization: boolean;
  ttsRate: number;
}) {
  const romanizationColIdx = headers.findIndex((h) =>
    h.toLowerCase().includes("romanization")
  );
  const koreanColIdx = Math.max(
    headers.findIndex((h) =>
      h.toLowerCase().includes("korean") || h.toLowerCase().includes("한국")
    ),
    0
  );

  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#4F7FE8]/20">
            {headers.map((h, hi) => {
              if (!showRomanization && hi === romanizationColIdx) return null;
              return (
                <th
                  key={hi}
                  className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-[#4F7FE8]"
                >
                  {h}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-t border-white/5 transition-colors hover:bg-white/5 ${
                ri % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
              }`}
            >
              {row.map((cell, ci) => {
                if (!showRomanization && ci === romanizationColIdx) return null;
                const isKorean = ci === koreanColIdx;
                return (
                  <td
                    key={ci}
                    className={`px-4 py-3 leading-snug ${
                      ci === 0
                        ? "font-bold text-[#4F7FE8] text-base"
                        : ci === romanizationColIdx
                        ? "text-[#8892B0] text-xs"
                        : "text-[#C0C8D8]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {renderInline(cell)}
                      {isKorean && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(cell, ttsRate);
                          }}
                          className="shrink-0 text-[10px] text-[#4A5568] hover:text-[#4F7FE8] transition-colors"
                          title="Hear pronunciation"
                        >
                          🔊
                        </button>
                      )}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
const FONT_SIZE_CLASS: Record<string, string> = {
  sm:   "text-sm leading-7",
  base: "text-base leading-8",
  lg:   "text-lg leading-9",
  xl:   "text-xl leading-10",
};

export function ChapterReader({
  content,
  showRomanization = true,
  ttsRate = 1.0,
  fontSize = "base",
}: Props) {
  const blocks = parseBlocks(content);

  return (
    <article className={`max-w-none ${FONT_SIZE_CLASS[fontSize] ?? FONT_SIZE_CLASS.base}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            // The chapter page already shows this title as its <h1>; a second
            // (previously white-on-white) heading only confused search engines.
            return null;

          case "h2":
            return (
              <h2
                key={idx}
                className="text-lg font-bold text-white mt-10 mb-4 pb-2 border-b border-white/10 flex items-center gap-2"
              >
                {renderInline(block.text)}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={idx}
                className="text-base font-semibold text-[#4F7FE8] mt-6 mb-2"
              >
                {renderInline(block.text)}
              </h3>
            );

          case "hr":
            return <hr key={idx} className="my-8 border-white/10" />;

          case "blockquote":
            if (block.flavor === "culture")
              return <CultureNote key={idx} lines={block.lines} />;
            if (block.flavor === "tip")
              return <TipBox key={idx} lines={block.lines} />;
            if (block.flavor === "warning")
              return <WarningBox key={idx} lines={block.lines} />;
            if (block.flavor === "conversation")
              return <ConversationBox key={idx} lines={block.lines} />;
            return <DefaultBlockquote key={idx} lines={block.lines} />;

          case "table":
            return (
              <TableBlock
                key={idx}
                headers={block.headers}
                rows={block.rows}
                showRomanization={showRomanization}
                ttsRate={ttsRate}
              />
            );

          case "ul":
            return (
              <ul key={idx} className="my-4 space-y-2 pl-1">
                {block.items.map((item, ii) => (
                  <li
                    key={ii}
                    className="flex items-start gap-3 text-[#C0C8D8] leading-relaxed"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4F7FE8] shrink-0" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={idx} className="my-4 space-y-2 pl-1">
                {block.items.map((item, ii) => (
                  <li
                    key={ii}
                    className="flex items-start gap-3 text-[#C0C8D8] leading-relaxed"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#4F7FE8]/20 text-[#4F7FE8] text-xs font-bold flex items-center justify-center mt-0.5">
                      {ii + 1}
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );

          case "paragraph":
            return (
              <p key={idx} className="text-[#C0C8D8] leading-8 mb-4">
                {renderInline(block.text)}
              </p>
            );

          default:
            return null;
        }
      })}
    </article>
  );
}
