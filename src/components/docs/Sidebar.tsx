import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Download, 
  MessageSquare, 
  Bot, 
  Zap, 
  Cpu, 
  Monitor, 
  Server, 
  FileText, 
  HelpCircle 
} from 'lucide-react';

const navItems = [
  { name: 'Get Started', href: '/docs/get-started', icon: BookOpen },
  { name: 'Install', href: '/docs/install', icon: Download },
  { name: 'Channels', href: '/docs/channels', icon: MessageSquare },
  { name: 'Agents', href: '/docs/agents', icon: Bot },
  { name: 'Capabilities', href: '/docs/capabilities', icon: Zap },
  { name: 'Models', href: '/docs/models', icon: Cpu },
  { name: 'Platforms', href: '/docs/platforms', icon: Monitor },
  { name: 'Gateway & Ops', href: '/docs/gateway-ops', icon: Server },
  { name: 'Reference', href: '/docs/reference', icon: FileText },
  { name: 'Help', href: '/docs/help', icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar__inner">
        <h3 className="docs-sidebar__title">Documentation</h3>
        <nav className="docs-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`docs-nav__link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} className="docs-nav__icon" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
