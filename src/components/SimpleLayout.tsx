interface SimpleLayoutProps {
  children: React.ReactNode
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card p-4">
        <h1 className="text-xl font-bold text-foreground">Franchise Launch OS v1.1</h1>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}