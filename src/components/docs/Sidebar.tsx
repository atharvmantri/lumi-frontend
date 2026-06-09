'use client';

import { useState } from 'react';
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
  HelpCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const toSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const navCategories = [
  {
    name: 'Get Started', icon: BookOpen, folder: 'get-started',
    topics: ['Introduction', 'Philosophy', 'Architecture', 'Quickstart']
  },
  {
    name: 'Install', icon: Download, folder: 'install',
    topics: ['Prerequisites', 'Windows', 'macOS', 'Linux', 'Docker', 'Troubleshooting']
  },
  {
    name: 'Channels', icon: MessageSquare, folder: 'channels',
    topics: ['Local UI', 'CLI', 'Discord', 'Slack', 'Microsoft Teams', 'Web API']
  },
  {
    name: 'Agents', icon: Bot, folder: 'agents',
    topics: ['Core Concepts', 'Base Agent', 'Custom Agents', 'Tool Binding', 'Memory', 'Permissions']
  },
  {
    name: 'Capabilities', icon: Zap, folder: 'capabilities',
    topics: ['System Control', 'File Management', 'Web Scraping', 'Code Execution', 'Scheduling']
  },
  {
    name: 'Models', icon: Cpu, folder: 'models',
    topics: ['Local LLMs', 'OpenAI', 'Anthropic', 'Gemini', 'Embedding Models', 'Fine-tuning']
  },
  {
    name: 'Platforms', icon: Monitor, folder: 'platforms',
    topics: ['Windows Desktop', 'Headless Server', 'Kubernetes']
  },
  {
    name: 'Gateway & Ops', icon: Server, folder: 'gateway-ops',
    topics: ['API Keys', 'Rate Limiting', 'Metrics', 'Logging', 'High Availability']
  },
  {
    name: 'Reference', icon: FileText, folder: 'reference',
    topics: ['CLI Commands', 'Config Options', 'REST API Specs']
  },
  {
    name: 'Help', icon: HelpCircle, folder: 'help',
    topics: ['FAQ', 'Community', 'Support', 'Contributing', 'Code of Conduct']
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (folder: string) => {
    setOpenCategories(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar__inner">
        <h3 className="docs-sidebar__title">Documentation</h3>
        <nav className="docs-nav">
          {navCategories.map((category) => {
            const Icon = category.icon;
            const isCategoryActive = pathname.startsWith(`/docs/${category.folder}`);
            const isOpen = openCategories[category.folder] || isCategoryActive;

            return (
              <div key={category.name} className="docs-nav__category">
                <button
                  onClick={() => toggleCategory(category.folder)}
                  className={`docs-nav__link ${isCategoryActive ? 'active' : ''}`}
                  style={{ width: '100%', justifyContent: 'space-between', border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={16} className="docs-nav__icon" />
                    {category.name}
                  </div>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                {isOpen && (
                  <div className="docs-nav__subtopics" style={{ paddingLeft: '28px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <Link
                      href={`/docs/${category.folder}`}
                      className={`docs-nav__sublink ${pathname === `/docs/${category.folder}` ? 'active' : ''}`}
                      style={{ padding: '6px 12px', fontSize: '0.85rem', color: pathname === `/docs/${category.folder}` ? 'var(--color-cyan)' : 'var(--color-text-secondary)', textDecoration: 'none', borderRadius: '4px' }}
                    >
                      Overview
                    </Link>
                    {category.topics.map(topic => {
                      const topicPath = `/docs/${category.folder}/${toSlug(topic)}`;
                      const isTopicActive = pathname === topicPath;
                      return (
                        <Link
                          key={topic}
                          href={topicPath}
                          className={`docs-nav__sublink ${isTopicActive ? 'active' : ''}`}
                          style={{ padding: '6px 12px', fontSize: '0.85rem', color: isTopicActive ? 'var(--color-cyan)' : 'var(--color-text-secondary)', textDecoration: 'none', borderRadius: '4px', transition: 'color 0.2s' }}
                        >
                          {topic}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
