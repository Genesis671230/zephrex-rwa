//main layout for the investor dashboard

import { User, PieChart, BarChart3, FileText, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router';


export const Sidebar = () => {

  const navigate = useNavigate();
  const pathname = useLocation(); 

  const isActive = (path: string) => pathname.pathname === path;

	return (
		<aside className="min-h-[calc(100vh-4rem)] w-64 border-r bg-white/50 backdrop-blur-sm">
		<nav className="space-y-2 p-6">
			<Link to="/investor/dashboard" className='my-2 flex'>
			<Button variant="ghost" className={`w-full justify-start ${isActive('/investor/dashboard') ? 'bg-purple-100 text-purple-700' : ''}`}>
				<PieChart className="mr-2 h-4 w-4" />
				Portfolio
			</Button>
				</Link>

      <Link to="/investor/analytics" className='my-2 flex'>
			<Button variant="ghost" className={`w-full justify-start ${isActive('/investor/analytics') ? 'bg-purple-100 text-purple-700' : ''}`}>
				<BarChart3 className="mr-2 h-4 w-4" />
				Analytics 
			</Button>
      </Link>

      <Link to="/investor/documents" className='my-2 flex'>
			<Button variant="ghost" className={`w-full justify-start ${isActive('/investor/documents') ? 'bg-purple-100 text-purple-700' : ''}`}>
				<FileText className="mr-2 h-4 w-4" />
				Documents
			</Button>
      </Link>

      <Link to="/investor/compliance" className='my-2 flex'>
			<Button variant="ghost" className={`w-full justify-start ${isActive('/investor/compliance') ? 'bg-purple-100 text-purple-700' : ''}`}>
				<Shield className="mr-2 h-4 w-4" />
				Compliance
			</Button>
      </Link>
			<Link to="/investor/profile" className='my-2 flex'> 
			<Button variant="ghost" className={`w-full justify-start ${isActive('/investor/profile') ? 'bg-purple-100 text-purple-700' : ''}`}>
				<User className="mr-2 h-4 w-4" />
				Profile
			</Button>
			</Link>
		</nav>
	</aside> 
	)
} 
export const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen w-full space-y-6 bg-gradient-to-br from-slate-50 to-slate-100">
			{/* Header */}
			<div className="mt-[5%]">
				<Sidebar />
			</div>

			<div className="w-full">{children}</div>
		</div>
	);
};
