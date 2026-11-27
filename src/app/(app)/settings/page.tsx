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
    <div className="min-h-screen bg-[#F8F5FF]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-[#140F2D] mb-2">Settings</h1>
        <p className="text-sm text-[#5A5475] mb-8">
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
        <section className="bg-white border border-[#EAE4F7] rounded-xl p-6 mb-4 shadow-sm">
          <h2 className="font-semibold text-[#140F2D] mb-4">Your name</h2>
          <form onSubmit={saveName} className="flex gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="What should we call you?"
              className="flex-1 bg-white border border-[#EAE4F7] rounded-lg px-3 py-2 text-sm text-[#140F2D] placeholder:text-[#9E98B8] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF3D8B]/20 focus:border-[#FF3D8B] transition-colors"
            />
            <button
              type="submit"
              className="text-sm bg-gradient-to-r from-[#7C5CFF] to-[#A78BFF] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </form>
          <p className="text-xs text-[#9E98B8] mt-2">Shown on your Home page. Optional.</p>
        </section>

        {/* Backup */}
        <section className="bg-white border border-[#EAE4F7] rounded-xl p-6 mb-4 shadow-sm">
          <h2 className="font-semibold text-[#140F2D] mb-1">Back up or move your progress</h2>
          <p className="text-sm text-[#5A5475] mb-4">
            {progress.xp} XP · {Object.values(progress.chapters).filter((c) => c.completed).length} chapters completed ·{" "}
            {Object.keys(progress.vocab).length} words known. Download a backup file to keep it safe or to continue on
            another device.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportProgress}
              className="text-sm bg-[#F8F5FF] border border-[#EAE4F7] text-[#140F2D] px-4 py-2 rounded-lg hover:bg-[#F2ECFF] transition-colors"
            >
              ⬇ Download backup
            </button>
            <button
              onClick={() => fileInput.current?.click()}
              className="text-sm bg-[#F8F5FF] border border-[#EAE4F7] text-[#140F2D] px-4 py-2 rounded-lg hover:bg-[#F2ECFF] transition-colors"
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
        <section className="bg-white border border-[#EAE4F7] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-[#140F2D] mb-1">Start over</h2>
          <p className="text-sm text-[#5A5475] mb-4">Clears XP, streak, chapter progress and known words in this browser.</p>
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
