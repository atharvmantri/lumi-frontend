import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MdxComponents } from '@/components/docs/MdxComponents';

export async function generateStaticParams() {
  const docsDir = path.join(process.cwd(), 'src/content/docs');
  const files = fs.readdirSync(docsDir);

  return files.map((file) => ({
    slug: [file.replace(/\.mdx$/, '')],
  }));
}

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/docs', `${slug.join('/')}.mdx`);
  
  let source = '';
  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return <h1>Document not found</h1>;
  }

  const { content, data } = matter(source);

  return (
    <article className="docs-article">
      <header className="docs-header">
        <h1 className="docs-title">{data.title}</h1>
        {data.description && <p className="docs-description">{data.description}</p>}
      </header>
      <div className="docs-body">
        <MDXRemote source={content} components={MdxComponents} />
      </div>
    </article>
  );
}
