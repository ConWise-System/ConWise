// app/(dashboard)/projectmanagement/layout.jsx
import PMNavbar from "../../../components/dashboard/pm/PMNavbar";
import Sidebar from "../../../components/dashboard/pm/Sidebar"; 

export default function ProjectManagementLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      {/* Sidebar: Bitaa irratti fixed ta'ee hafa */}
      <div className="hidden lg:block w-[280px] fixed h-full z-50">
        <Sidebar />
      </div>

      <div className="flex-1 lg:ml-[280px] flex flex-col">
        {/* Navbar: Gubbaa irratti hordofa */}
        <PMNavbar />
        
        {/* Content: Page kee as keessatti ragaa */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}