"use client";

import Link from "next/link";
import { useState } from "react";

export function SubscriptionGate() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors font-semibold"
        style={{ background: "rgba(232,67,111,0.1)", color: "#E8436F", border: "1px solid rgba(232,67,111,0.2)" }}
      >
        👑 Pro
      </button>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(30,18,37,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-3xl p-8 max-w-sm w-full text-center"
            style={{ background: "white", border: "1px solid rgba(240,230,238,1)", boxShadow: "0 16px 48px rgba(232,67,111,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #E8436F, #9B7FE8)" }}
            >
              <span className="text-3xl">👑</span>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#1E1225" }}>
              Pro Chapter
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B5F7A" }}>
              Upgrade to Pro to unlock all 16 chapters, games, K-Drama phrases, and more.
            </p>
            <Link
              href="/pricing"
              className="block w-full py-3 rounded-xl font-semibold text-white text-sm mb-3"
              style={{ background: "linear-gradient(to right, #E8436F, #F06B8A)", boxShadow: "0 4px 16px rgba(232,67,111,0.3)" }}
            >
              Upgrade to Pro — from $7.99/mo
            </Link>
            <button
              onClick={() => setShowModal(false)}
              className="block w-full text-sm py-2"
              style={{ color: "#B0A8BB" }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
