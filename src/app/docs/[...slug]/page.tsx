import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MdxComponents } from '@/components/docs/MdxComponents';



export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const { slug } = await params;
  
  const basePath = path.join(process.cwd(), 'src/content/docs', ...slug);
  let filePath = basePath + '.mdx';
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(basePath, 'index.mdx');
  }
  
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
