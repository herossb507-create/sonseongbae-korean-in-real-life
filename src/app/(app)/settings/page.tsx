"use client";

import { useEffect, useRef, useState } from "react";
import {
  EMPTY_PROGRESS,
  type Progress,
  readProgress,
  resetProgress,
  setDisplayName,
  updateProgress,
  useProgress,
} from "@/lib/progress";

const BACKUP_VERSION = 1;

export default function SettingsPage() {
  const progress = useProgress() ?? EMPTY_PROGRESS;
  const [name, setName] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(readProgress().displayName);
  }, []);

  function saveName(e: React.FormEvent) {
    e.preventDefault();
    setDisplayName(name);
    setMessage({ ok: true, text: "✓ Name saved." });
  }

  // Progress lives in this browser only, so a file is the way to move it to another device.
  function exportProgress() {
    const blob = new Blob([JSON.stringify({ version: BACKUP_VERSION, progress: readProgress() }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `korean-in-real-life-progress-${new Date().toLocaleDateString("sv-SE")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importProgress(file: File) {
    try {
      const data = JSON.parse(await file.text()) as { version?: number; progress?: Partial<Progress> };
      if (data.version !== BACKUP_VERSION || typeof data.progress !== "object" || data.progress === null) {
        throw new Error("not a progress backup");
      }
      updateProgress(() => ({ ...EMPTY_PROGRESS, ...data.progress }));
      setName(readProgress().displayName);
      setMessage({ ok: true, text: "✓ Progress restored from backup." });
    } catch {
      setMessage({ ok: false, text: "That file isn't a Korean in Real Life progress backup." });
    }
  }

  function reset() {
    if (!window.confirm("Delete all progress saved in this browser? This can't be undone.")) return;
    resetProgress();
    setName("");
    setMessage({ ok: true, text: "Progress reset." });
  }

  return (
    <div className="min-h-screen bg-[#FFF5F8]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-[#1E1225] mb-2">Settings</h1>
        <p className="text-sm text-[#6B5F7A] mb-8">
          No account needed. Your progress is saved in this browser on this device.
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm border ${
              message.ok
                ? "bg-[#34C899]/10 border-[#34C899]/30 text-[#1F9E76]"
                : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Name */}
        <section className="bg-white border border-[#F0E6EE] rounded-xl p-6 mb-4 shadow-sm">
          <h2 className="font-semibold text-[#1E1225] mb-4">Your name</h2>
          <form onSubmit={saveName} className="flex gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="What should we call you?"
              className="flex-1 bg-white border border-[#F0E6EE] rounded-lg px-3 py-2 text-sm text-[#1E1225] placeholder:text-[#B0A8BB] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8436F]/20 focus:border-[#E8436F] transition-colors"
            />
            <button
              type="submit"
              className="text-sm bg-gradient-to-r from-[#9B7FE8] to-[#B099FF] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </form>
          <p className="text-xs text-[#B0A8BB] mt-2">Shown on your Home page. Optional.</p>
        </section>

        {/* Backup */}
        <section className="bg-white border border-[#F0E6EE] rounded-xl p-6 mb-4 shadow-sm">
          <h2 className="font-semibold text-[#1E1225] mb-1">Back up or move your progress</h2>
          <p className="text-sm text-[#6B5F7A] mb-4">
            {progress.xp} XP · {Object.values(progress.chapters).filter((c) => c.completed).length} chapters completed ·{" "}
            {Object.keys(progress.vocab).length} words known. Download a backup file to keep it safe or to continue on
            another device.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportProgress}
              className="text-sm bg-[#FFF5F8] border border-[#F0E6EE] text-[#1E1225] px-4 py-2 rounded-lg hover:bg-[#FFF0F5] transition-colors"
            >
              ⬇ Download backup
            </button>
            <button
              onClick={() => fileInput.current?.click()}
              className="text-sm bg-[#FFF5F8] border border-[#F0E6EE] text-[#1E1225] px-4 py-2 rounded-lg hover:bg-[#FFF0F5] transition-colors"
            >
              ⬆ Restore from file
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importProgress(file);
                e.target.value = "";
              }}
            />
          </div>
        </section>

        {/* Reset */}
        <section className="bg-white border border-[#F0E6EE] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-[#1E1225] mb-1">Start over</h2>
          <p className="text-sm text-[#6B5F7A] mb-4">Clears XP, streak, chapter progress and known words in this browser.</p>
          <button
            onClick={reset}
            className="text-sm border border-[#EF4444]/30 text-[#EF4444] px-4 py-2 rounded-lg hover:bg-[#EF4444]/10 transition-colors"
          >
            Reset progress
          </button>
        </section>
      </div>
    </div>
  );
}
