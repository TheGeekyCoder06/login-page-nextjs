'use client';
import React, { useState, useEffect } from 'react';

// --- Type Definitions and Context Setup ---

// Interface for the logged-in Teacher object
interface Teacher {
  id: string;
  name: string; // This is the dynamic field fetched after login
  role: string;
}

// Type for the main navigation state
type ViewName = 'dashboard' | 'classes' | 'grading' | 'schedule';

// Define the shape of the Teacher Context
interface TeacherContextType {
    teacher: Teacher | null;
    isLoading: boolean;
}

// Create the Context to share teacher data across components
const TeacherContext = React.createContext<TeacherContextType>({
    teacher: null,
    isLoading: true,
});

// --- Existing Interfaces ---
interface StatProps {
  id: number;
  title: string;
  value: string;
  change: string;
  color: string;
  icon: React.ElementType;
}

interface GradeDistributionItem {
  grade: string;
  students: number;
}

interface Submission {
  id: number;
  student: string;
  assignment: string;
  status: string;
  time: string;
}

interface StatCardProps extends StatProps {}

interface GradeBarChartProps {
    data: GradeDistributionItem[];
    title: string;
}

interface SubmissionTableProps {
    data: Submission[];
    title: string;
}

interface SidebarProps {
    currentView: ViewName;
    setView: React.Dispatch<React.SetStateAction<ViewName>>;
    isMobileOpen: boolean;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface HeaderProps {
    currentView: ViewName;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// --- Icon Definitions (Replacing lucide-react imports) ---
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
// --- End Icon Definitions ---

// --- Mock Data (Teacher Focused) ---
const TEACHER_STATS: StatProps[] = [
  { id: 1, title: "Total Students", value: "145", change: "Across 4 classes", color: "bg-indigo-600", icon: GraduationCapIcon },
  { id: 2, title: "Pending Grades", value: "24", change: "Due by Friday", color: "bg-red-600", icon: BookOpenIcon },
  { id: 3, title: "Avg Class Grade (A)", value: "88.4%", change: "1.2% Gain last week", color: "bg-green-600", icon: DashboardIcon },
  { id: 4, title: "Next Class", value: "History 101", change: "10:00 AM Today", color: "bg-amber-600", icon: CalendarIcon },
];

const GRADE_DISTRIBUTION_DATA: GradeDistributionItem[] = [
  { grade: 'A', students: 40 },
  { grade: 'B', students: 55 },
  { grade: 'C', students: 30 },
  { grade: 'D', students: 10 },
  { grade: 'F', students: 5 },
];

const RECENT_SUBMISSIONS: Submission[] = [
  { id: 1, student: 'Alice Johnson', assignment: 'WWII Essay', status: 'Pending', time: '10 mins ago' },
  { id: 2, student: 'Bob Williams', assignment: 'Quiz 2', status: 'Graded (A-)', time: '2 hours ago' },
  { id: 3, student: 'Charlie Brown', assignment: 'Project Proposal', status: 'Submitted', time: 'Yesterday' },
  { id: 4, student: 'Diana Prince', assignment: 'WWII Essay', status: 'Pending', time: 'Yesterday' },
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

// Mock Bar Chart component using Tailwind/divs for Grade Distribution
const GradeBarChart: React.FC<GradeBarChartProps> = ({ data, title }) => {
  const totalStudents = data.reduce((sum, item) => sum + item.students, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-80">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="flex justify-around items-end h-3/4 space-x-4">
        {data.map((item, index) => {
          const heightPercent = (item.students / totalStudents) * 100;
          return (
            <div key={index} className="flex flex-col items-center h-full w-1/5 group">
              <span className="text-xs mb-1 text-gray-700 transition-opacity opacity-100 group-hover:opacity-100">{item.students}</span>
              <div
                className="w-full rounded-t-lg transition-all duration-500 ease-out bg-indigo-500 hover:bg-indigo-400 cursor-pointer shadow-md"
                style={{ height: `${heightPercent}%` }}
                title={`${item.grade} Grade: ${item.students} Students`}
              ></div>
              <span className="text-sm mt-2 text-gray-800 font-bold">{item.grade}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Mock Data Table component for Submissions
const SubmissionTable: React.FC<SubmissionTableProps> = ({ data, title }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.student}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.assignment}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status.includes('Pending') ? 'bg-red-100 text-red-800' : 
                    item.status.includes('Graded') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setMobileOpen }) => {
  const { teacher } = React.useContext(TeacherContext); // Get teacher data
    
  const navItems = [
    { name: 'Dashboard', icon: DashboardIcon, view: 'dashboard' as ViewName },
    { name: 'My Classes', icon: BookOpenIcon, view: 'classes' as ViewName },
    { name: 'Grading Center', icon: GraduationCapIcon, view: 'grading' as ViewName },
    { name: 'Schedule', icon: CalendarIcon, view: 'schedule' as ViewName },
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
  
  const displayName = teacher?.name || 'Teacher';
  const displayInitial = teacher?.name ? teacher.name[0] : 'T';

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
          Teacher Portal
        </span>
      </div>
      <div className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.view} item={item} />
        ))}
      </div>
      <div className="pt-4 border-t border-indigo-600">
        <p className="text-sm text-indigo-300">Current User</p>
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
    const { teacher } = React.useContext(TeacherContext); // Get teacher data
    
    const viewTitleMap: Record<ViewName, string> = {
        dashboard: 'Teacher Dashboard Overview',
        classes: 'My Classes',
        grading: 'Grading Center',
        schedule: 'My Schedule',
    };
    
    const displayName = teacher?.name || 'Teacher';
    const displayInitial = teacher?.name ? teacher.name[0] : 'T';

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
                    {viewTitleMap[currentView] || 'Teacher Portal'}
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
const MyClassesPage: React.FC = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Classes</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg text-gray-700">
                <p>This page lists all classes taught by Teacher Sarah, including quick links to attendance and gradebooks.</p>
            </div>
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <p className="font-semibold text-gray-700 mb-2">Class List Placeholder:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>History 101 (35 students)</li>
                    <li>AP World History (32 students)</li>
                    <li>Introduction to Civics (40 students)</li>
                </ul>
            </div>
        </div>
    </div>
);

const GradingCenterPage: React.FC = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Grading Center</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg text-gray-700">
                <p>This is where assignments pending review are listed, allowing batch grading and detailed feedback entry.</p>
            </div>
            <SubmissionTable title="Assignments Pending Review" data={RECENT_SUBMISSIONS.filter(s => s.status === 'Pending')} />
        </div>
    </div>
);

const SchedulePage: React.FC = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Schedule</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg text-gray-700">
                <p>A calendar view showing classes, meetings, and office hours. Use this to track your daily and weekly commitments.</p>
            </div>
            <div className="mt-6 p-4 border border-gray-200 rounded-lg text-gray-700">
                <h3 className="font-semibold mb-2">Today's Timeline:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li><span className="font-medium">8:00 AM:</span> Prep period</li>
                    <li><span className="font-medium">10:00 AM:</span> History 101 (Room 301)</li>
                    <li><span className="font-medium">12:30 PM:</span> Lunch / Office Hours</li>
                    <li><span className="font-medium">2:00 PM:</span> Faculty Meeting (Library)</li>
                </ol>
            </div>
        </div>
    </div>
);


const TeacherDashboardPage: React.FC = () => {
    const { teacher, isLoading } = React.useContext(TeacherContext); // Get teacher data

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-xl text-indigo-600">Loading Teacher Profile...</p>
            </div>
        );
    }
    
    // Extract first name for a friendly welcome message
    const teacherFirstName = teacher?.name?.split(' ')[0] || 'Teacher';
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Welcome Banner now uses the dynamic name */}
            <div className="bg-indigo-600 p-6 rounded-xl shadow-xl text-white">
                <h2 className="text-2xl font-bold mb-1">Welcome back, {teacherFirstName}!</h2>
                <p className="text-indigo-200">You have <span className="font-bold">24 assignments</span> pending review. Stay focused!</p>
            </div>

            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEACHER_STATS.map(stat => (
                    <StatCard key={stat.id} {...stat} />
                ))}
            </div>

            {/* Charts & Submissions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                <SubmissionTable title="Recent Submissions & Grades" data={RECENT_SUBMISSIONS} />
                </div>
                <GradeBarChart 
                    title="Overall Grade Distribution (Semester)" 
                    data={GRADE_DISTRIBUTION_DATA}
                />
            </div>
        </div>
    );
};


// --- Main App Component ---

const App: React.FC = () => {
    // State for navigation
    const [currentView, setCurrentView] = useState<ViewName>('dashboard');
    // State for mobile sidebar visibility
    const [isMobileOpen, setMobileOpen] = useState<boolean>(false);
    
    // States for Teacher Context
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Simulated API call to get teacher details after login/signup
    useEffect(() => {
        // In a real application, this would fetch data based on an auth token.
        // For now, we simulate success with a delay and mock data.
        setTimeout(() => {
            const mockTeacher: Teacher = {
                id: 'Tsarah123',
                name: 'Sarah Connor', // <--- This name comes from the simulated backend/signup
                role: 'Teacher',
            };
            setTeacher(mockTeacher);
            setIsLoading(false);
        }, 1200);
    }, []);

    // Conditional rendering based on currentView
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <TeacherDashboardPage />;
            case 'classes':
                return <MyClassesPage />;
            case 'grading':
                return <GradingCenterPage />;
            case 'schedule':
                return <SchedulePage />;
            default:
                return <TeacherDashboardPage />;
        }
    };

    return (
        // Wrap the entire application in the TeacherContext Provider
        <TeacherContext.Provider value={{ teacher, isLoading }}>
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
        </TeacherContext.Provider>
    );
};

export default App;
