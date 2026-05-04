import EngineerSidebar from "../../../components/dashboard/engineer/EngineerSidebar.jsx";

export default function EngineerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      {/* Sidebar - fixed left */}
      <aside className="fixed inset-y-0 left-0 z-50">
        <EngineerSidebar />
      </aside>

      {/* Main Content Area */}
      {/* ml-64 kun sidebar isaa bal'ina 256px (w-64) yoo qabaate dha */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}