import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Wand2, LayoutTemplate, Film, Save } from "lucide-react";
import { clsx } from "clsx";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-xl tracking-tight group-hover:text-white/80 transition-colors">Geneseez Studio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/new" active={location === "/new"}>New Project</NavLink>
            <NavLink href="/projects" active={location === "/projects"}>Library</NavLink>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-black">
        <div className="container mx-auto px-6 text-center text-zinc-600 text-sm">
          <p>© 2024 Geneseez Studio. AI-Powered Minecraft Creation.</p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link href={href} className={clsx(
      "text-sm font-medium transition-colors hover:text-white cursor-pointer",
      active ? "text-white" : "text-zinc-500"
    )}>
      {children}
    </Link>
  );
}
