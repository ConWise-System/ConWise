import EngineerSidebar from "@/components/dashboard/engineer/EngineerSidebar";

export default function EngineerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      {/* Sidebar fixed left */}
      <aside className="fixed inset-y-0 left-0">
        <EngineerSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}