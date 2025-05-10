import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Book, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAcademicYears } from '../../api/academicYears';
import { AcademicYear } from '../../types/academicYear';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const years = await getAcademicYears();
        console.log(years);
        setAcademicYears(years);
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicYears();
  }, []);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">EduQR Portal</span>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Academic Years
              </div>
              {/* Dynamically render academic years */}
              {loading ? (
                <div className="px-3 py-2 text-gray-400 text-sm">Loading...</div>
              ) : (
                (academicYears??[]).map((year) => (
                  <NavLink
                    key={year.id}
                    to={`/dashboard/${year.code.replace(/\\s+/g, '-')}`}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`
                    }
                    onClick={() => onClose()}
                  >
                    <Book className="mr-3 h-5 w-5 text-gray-500" />
                    {year.label}
                  </NavLink>
                ))
              )}
              {/* Masters link remains static */}
              <NavLink
                to="/dashboard/masters"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md`
                }
                onClick={() => onClose()}
              >
                <GraduationCap className="mr-3 h-5 w-5 text-gray-500" />
                Masters
              </NavLink>
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;