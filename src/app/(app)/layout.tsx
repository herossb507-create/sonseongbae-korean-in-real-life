import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // Phones: top bar above the page. Desktop (md+): sidebar beside it.
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FFF5F8]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
