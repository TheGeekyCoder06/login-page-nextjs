'use client';
import React, { useState, useEffect } from 'react';

// --- Type Definitions and Context Setup ---

// Interface for the logged-in Student object
interface Student {
  id: string;
  name: string; // Dynamic field fetched after login
  major: string;
}

// Type for the main navigation state
type StudentViewName = 'dashboard' | 'grades' | 'assignments' | 'resources';

// Define the shape of the Student Context
interface StudentContextType {
    student: Student | null;
    isLoading: boolean;
}

// Create the Context to share student data across components
const StudentContext = React.createContext<StudentContextType>({
    student: null,
    isLoading: true,
});

// --- Existing Interfaces (Reused and adapted) ---
interface StatProps {
  id: number;
  title: string;
  value: string;
  change: string;
  color: string;
  icon: React.ElementType;
}

interface GradeSummaryItem {
  course: string;
  grade: string;
  score: number;
}

interface Assignment {
  id: number;
  course: string;
  assignment: string;
  status: string;
  time: string;
}

interface StatCardProps extends StatProps {}

interface GradeSummaryTableProps {
    data: GradeSummaryItem[];
    title: string;
}

interface AssignmentsTableProps {
    data: Assignment[];
    title: string;
}

interface SidebarProps {
    currentView: StudentViewName;
    setView: React.Dispatch<React.SetStateAction<StudentViewName>>;
    isMobileOpen: boolean;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface HeaderProps {
    currentView: StudentViewName;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// --- Icon Definitions (Reused from Teacher Portal) ---
const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const GraduationCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.95c.78.22.84.97.22 1.58l-5.65 5.65c-.6.6-.96.24-1.58-.22l-1.46-1.46"/><path d="m15.5 15.5-1.46-1.46"/><path d="m15.5 15.5-1.46-1.46"/><path d="m20.2 7.8-1.46-1.46"/><path d="m3 21 1.46-1.46"/><path d="m3 21 1.46-1.46"/><path d="m20.2 7.8-1.46-1.46"/></svg>
);
const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.38 21a1.94 1.94 0 0 0 3.24 0"/></svg>
);
const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 8.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
);

// --- Mock Data (Student Focused) ---
const STUDENT_STATS: StatProps[] = [
  { id: 1, title: "Current GPA", value: "3.75", change: "Up 0.1 from last sem.", color: "bg-green-600", icon: GraduationCapIcon },
  { id: 2, title: "Unsubmitted Work", value: "3", change: "Due this week", color: "bg-red-600", icon: BookOpenIcon },
  { id: 3, title: "Next Class", value: "Calc II", change: "11:00 AM Today", color: "bg-indigo-600", icon: CalendarIcon },
  { id: 4, title: "Attendance Rate", value: "95%", change: "Excellent", color: "bg-amber-600", icon: DashboardIcon },
];

const UPCOMING_ASSIGNMENTS: Assignment[] = [
  { id: 101, course: 'History 201', assignment: 'Research Paper Outline', status: 'Due Tomorrow', time: '8:00 PM' },
  { id: 102, course: 'Calc II', assignment: 'Problem Set 5', status: 'Due Fri, Oct 25', time: '11:59 PM' },
  { id: 103, course: 'English 101', assignment: 'Draft 2 Submission', status: 'Submitted', time: 'Mon, Oct 28' },
  { id: 104, course: 'Physics I', assignment: 'Lab Report 3', status: 'Graded (B)', time: 'Received' },
];

const GRADE_SUMMARY: GradeSummaryItem[] = [
  { course: 'History 201', grade: 'A-', score: 91 },
  { course: 'Calculus II', grade: 'B+', score: 88 },
  { course: 'English 101', grade: 'A', score: 95 },
  { course: 'Physics I', grade: 'B', score: 84 },
];
// --- End Mock Data ---


// --- Components ---

const StatCard: React.FC<StatCardProps> = ({ title, value, change, color, icon: Icon }) => (
  <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200 transition duration-300 hover:shadow-xl transform hover:-translate-y-0.5">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className={'p-3 rounded-full text-white ' + color}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <p className="mt-2 text-4xl font-extrabold text-gray-900">{value}</p>
    <p className="mt-2 text-xs font-semibold text-gray-600">
      {change}
    </p>
  </div>
);

// Component to show list of grades
const GradeSummaryTable: React.FC<GradeSummaryTableProps> = ({ data, title }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.course}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.score}%</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 
                    item.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {item.grade}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Component to show list of assignments
const AssignmentsTable: React.FC<AssignmentsTableProps> = ({ data, title }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status/Due</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.course}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.assignment}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status.includes('Due') ? 'bg-red-100 text-red-800' : 
                    item.status.includes('Submitted') ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setMobileOpen }) => {
  const { student } = React.useContext(StudentContext); 
    
  const navItems = [
    { name: 'Dashboard', icon: DashboardIcon, view: 'dashboard' as StudentViewName },
    { name: 'My Grades', icon: GraduationCapIcon, view: 'grades' as StudentViewName },
    { name: 'Assignments', icon: BookOpenIcon, view: 'assignments' as StudentViewName },
    { name: 'Resources', icon: FolderIcon, view: 'resources' as StudentViewName },
  ];

  const NavItem: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const isActive = currentView === item.view;
    return (
      <button
        onClick={() => { setView(item.view); setMobileOpen(false); }}
        className={`flex items-center w-full p-3 rounded-xl transition duration-150 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
        }`}
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span className="font-semibold">{item.name}</span>
      </button>
    );
  };
  
  const displayName = student?.name || 'Student';
  const displayInitial = student?.name ? student.name[0] : 'S';

  return (
    <>
    {/* Overlay for mobile */}
    {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-20 md:hidden" 
          onClick={() => setMobileOpen(false)}
        ></div>
    )}
    
    <nav 
      className={`fixed inset-y-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-indigo-700 p-6 space-y-8 z-30 flex flex-col shadow-2xl`}
    >
      <div className="flex items-center justify-center p-2">
        <span className="text-2xl font-extrabold text-white tracking-wider">
          Student Portal
        </span>
      </div>
      <div className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.view} item={item} />
        ))}
      </div>
      <div className="pt-4 border-t border-indigo-600">
        <p className="text-sm text-indigo-300">Current Student</p>
        <div className="flex items-center mt-2 p-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 text-indigo-700 font-bold text-lg border-2 border-indigo-400">
                {displayInitial}
            </div>
            <span className="text-base font-semibold">{displayName}</span>
        </div>
      </div>
    </nav>
    </>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setMobileOpen }) => {
    const { student } = React.useContext(StudentContext); 
    
    const viewTitleMap: Record<StudentViewName, string> = {
        dashboard: 'Student Dashboard Overview',
        grades: 'My Grades',
        assignments: 'Course Assignments',
        resources: 'Learning Resources',
    };
    
    const displayName = student?.name || 'Student';
    const displayInitial = student?.name ? student.name[0] : 'S';

    return (
        <header className="sticky top-0 bg-white shadow-md border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <div className="flex items-center">
                {/* Mobile Menu Button */}
                <button 
                  className="p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 mr-4 transition"
                  onClick={() => setMobileOpen(true)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {viewTitleMap[currentView] || 'Student Portal'}
                </h1>
            </div>
            
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition relative">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span>
                </button>
                <div className="flex items-center cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition">
                    <span className="mr-3 text-sm font-medium text-gray-700 hidden sm:inline">{displayName}</span>
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        {displayInitial}
                    </div>
                </div>
            </div>
        </header>
    );
};

// Mock Pages for Navigation
const MyGradesPage: React.FC = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Grades</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg text-gray-700">
                <p>This page provides a detailed breakdown of your current grades, scores, and grade history for all enrolled courses.</p>
            </div>
            <div className="mt-6">
                <GradeSummaryTable title="Current Course Grades" data={GRADE_SUMMARY} />
            </div>
        </div>
    </div>
);

const AssignmentsPage: React.FC = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Course Assignments</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg text-gray-700">
                <p>Track all past, present, and future assignments. Use the 'View' button to access submission portals.</p>
            </div>
            <div className="mt-6">
                <AssignmentsTable title="All Current & Recent Assignments" data={UPCOMING_ASSIGNMENTS} />
            </div>
        </div>
    </div>
);

const ResourcesPage: React.FC = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Learning Resources</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg text-gray-700">
                <p>Access lecture notes, readings, external links, and study guides uploaded by your instructors.</p>
            </div>
            <div className="mt-6 p-4 border border-gray-200 rounded-lg text-gray-700">
                <h3 className="font-semibold mb-2">Popular Downloads:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><span className="font-medium">Calculus II:</span> Lecture 7 Slides (PDF)</li>
                    <li><span className="font-medium">History 201:</span> Primary Source Reading List</li>
                    <li><span className="font-medium">Student Handbook:</span> Academic Policies 2024-2025</li>
                </ul>
            </div>
        </div>
    </div>
);


const StudentDashboardPage: React.FC = () => {
    const { student, isLoading } = React.useContext(StudentContext); 

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-xl text-indigo-600">Loading Student Profile...</p>
            </div>
        );
    }
    
    // Extract first name for a friendly welcome message
    const studentFirstName = student?.name?.split(' ')[0] || 'Student';
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Welcome Banner now uses the dynamic name */}
            <div className="bg-indigo-600 p-6 rounded-xl shadow-xl text-white">
                <h2 className="text-2xl font-bold mb-1">Hello, {studentFirstName}!</h2>
                <p className="text-indigo-200">Your current major is **{student?.major}**. Keep up the great work!</p>
            </div>

            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STUDENT_STATS.map(stat => (
                    <StatCard key={stat.id} {...stat} />
                ))}
            </div>

            {/* Assignments and Grades Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AssignmentsTable title="Upcoming Assignments" data={UPCOMING_ASSIGNMENTS.filter(a => a.status.includes('Due'))} />
                </div>
                <GradeSummaryTable 
                    title="Course Grades Summary" 
                    data={GRADE_SUMMARY.slice(0, 4)} // Show first 4 courses
                />
            </div>
        </div>
    );
};


// --- Main App Component ---

const App: React.FC = () => {
    // State for navigation
    const [currentView, setCurrentView] = useState<StudentViewName>('dashboard');
    // State for mobile sidebar visibility
    const [isMobileOpen, setMobileOpen] = useState<boolean>(false);
    
    // States for Student Context
    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Simulated API call to get student details after login/signup
    useEffect(() => {
        // Simulate fetching student data
        setTimeout(() => {
            const mockStudent: Student = {
                id: 'A_miller456',
                name: 'Alex Miller', // <--- This name comes from the simulated backend/signup
                major: 'Computer Science',
            };
            setStudent(mockStudent);
            setIsLoading(false);
        }, 1200);
    }, []);

    // Conditional rendering based on currentView
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <StudentDashboardPage />;
            case 'grades':
                return <MyGradesPage />;
            case 'assignments':
                return <AssignmentsPage />;
            case 'resources':
                return <ResourcesPage />;
            default:
                return <StudentDashboardPage />;
        }
    };

    return (
        // Wrap the entire application in the StudentContext Provider
        <StudentContext.Provider value={{ student, isLoading }}>
            <div className="min-h-screen bg-gray-100 font-sans antialiased flex">
                {/* Sidebar */}
                <Sidebar 
                    currentView={currentView} 
                    setView={setCurrentView} 
                    isMobileOpen={isMobileOpen}
                    setMobileOpen={setMobileOpen}
                />
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Header */}
                    <Header currentView={currentView} setMobileOpen={setMobileOpen} />
                    
                    {/* Page Content (Responsive Padding) */}
                    <main className="flex-1 pb-12">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </StudentContext.Provider>
    );
};

export default App;
