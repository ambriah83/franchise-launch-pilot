import "./index.css"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card p-4">
        <h1 className="text-2xl font-bold">Franchise Launch OS v1.1</h1>
        <p className="text-muted-foreground">Enterprise Franchise Management System</p>
      </header>
      
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-primary">Total Projects</h3>
              <p className="text-3xl font-bold mt-2">47</p>
              <p className="text-sm text-muted-foreground">12 active locations</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-primary">Total Budget</h3>
              <p className="text-3xl font-bold mt-2">$12.5M</p>
              <p className="text-sm text-muted-foreground">$2.1M remaining</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-primary">Pending Orders</h3>
              <p className="text-3xl font-bold mt-2">23</p>
              <p className="text-sm text-muted-foreground">5 overdue deliveries</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-success font-medium">✅ All systems operational</p>
              <p className="text-sm text-muted-foreground mt-1">Franchise Launch OS is running smoothly</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App