"use client";

import Link from "next/link";
import { useState } from "react";

export function SubscriptionGate() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-200"
      >
        🔒 Pro
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pro chapter</h2>
              <p className="text-gray-500 text-sm">
                Upgrade to Pro to unlock all 16 chapters, pronunciation audio, and vocabulary
                flashcards.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/pricing"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700"
              >
                See plans — from $7.99/mo
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className="block w-full text-center text-gray-500 text-sm hover:text-gray-700"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
