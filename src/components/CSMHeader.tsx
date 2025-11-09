import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Database,
  LayoutDashboard,
  Map,
  Monitor,
  Moon,
  Network,
  Plus,
  Search,
  Settings2,
  Sun,
  Terminal,
  Ticket,
  User,
  X,
} from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Theme, useTheme } from '@/hooks/use-theme'
import { NewConfig } from '@/components/pop-up/new-config'

interface CSMHeaderProps {
  onQuickAction?: (action: string) => void
}

export default function CSMHeader({ onQuickAction }: CSMHeaderProps) {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isNewConfigOpen, setIsNewConfigOpen] = useState(false)

  const handleQuickAction = (action: string) => {
    if (onQuickAction) {
      onQuickAction(action)
    }
    setIsQuickActionsOpen(false)
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />
    if (theme === 'dark') return <Moon className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Network className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">CSM Dashboard</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              activeProps={{
                className: 'text-primary',
              }}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/broadband-search"
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              activeProps={{
                className: 'text-primary',
              }}
            >
              <Search className="h-4 w-4" />
              <span>Broadband Search</span>
            </Link>
            <Link
              to="/network-topology"
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              activeProps={{
                className: 'text-primary',
              }}
            >
              <Network className="h-4 w-4" />
              <span>Network Topology</span>
            </Link>
            <Link
              to="/geographic-maps"
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              activeProps={{
                className: 'text-primary',
              }}
            >
              <Map className="h-4 w-4" />
              <span>Geographic Maps</span>
            </Link>
            <Link
              to="/database-management"
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              activeProps={{
                className: 'text-primary',
              }}
            >
              <Database className="h-4 w-4" />
              <span>Database</span>
            </Link>
          </nav>

          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsQuickActionsOpen(true)}
              aria-label="Quick Actions"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </Button>

            <Button variant="ghost" size="icon" aria-label="CLI Access">
              <Terminal className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User menu">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-background shadow-lg transform transition-transform duration-300 ease-in-out ${
          isQuickActionsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsQuickActionsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              setIsNewConfigOpen(true)
              setIsQuickActionsOpen(false)
            }}
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Configure ONT
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleQuickAction('new-ticket')}
          >
            <Ticket className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleQuickAction('new-topology')}
          >
            <Network className="mr-2 h-4 w-4" />
            New Topology
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleQuickAction('new-user')}
          >
            <User className="mr-2 h-4 w-4" />
            New User
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleQuickAction('add-device')}
          >
            <Database className="mr-2 h-4 w-4" />
            Add Network Device
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleQuickAction('quick-search')}
          >
            <Search className="mr-2 h-4 w-4" />
            Quick Search
          </Button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center">
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers, tickets, devices..."
                className="pl-10 pr-10"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearchOpen(false)
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <NewConfig open={isNewConfigOpen} onOpenChange={setIsNewConfigOpen} />
    </>
  )
}