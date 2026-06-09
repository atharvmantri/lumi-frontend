import Sidebar from '@/components/docs/Sidebar';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="docs-layout">
      <Sidebar />
      <main className="docs-content">
        <div className="docs-content__inner">
          {children}
        </div>
      </main>
    </div>
  );
}
