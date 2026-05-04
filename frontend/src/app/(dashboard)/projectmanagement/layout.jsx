// app/(dashboard)/projectmanagement/layout.jsx
import PMNavbar from "../../../components/dashboard/pm/PMNavbar";
import Sidebar from "../../../components/dashboard/pm/Sidebar"; 

export default function ProjectManagementLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
     
      <div className="hidden lg:block w-[280px] fixed h-full z-50">
        <Sidebar />
      </div>

      <div className="flex-1 lg:ml-[280px] flex flex-col">
        
        <PMNavbar />
        
     
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}