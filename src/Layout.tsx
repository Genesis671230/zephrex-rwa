const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
      {children}
    </div>
  )
}

export default Layout;