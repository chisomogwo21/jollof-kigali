
import React from 'react';
import { useApp } from '../AppContext';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage: React.FC = () => {
  const { posts, settings } = useApp();
  const content = settings.pageContent.blog;

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 serif">{content.headline}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            {content.subheadline}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map(post => (
            <article key={post.id} className="group cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden mb-8 bg-[#111]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.2em] text-gold font-bold">
                  <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(post.date).toLocaleDateString()}</span>
                  <span className="flex items-center"><User size={12} className="mr-1" /> {post.author}</span>
                </div>
                <h2 className="text-2xl font-bold serif group-hover:text-gold transition-colors">{post.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">
                  {post.excerpt}
                </p>
                <button className="flex items-center text-xs uppercase tracking-widest font-bold pt-4 group-hover:translate-x-2 transition-transform">
                  Read More <ArrowRight size={14} className="ml-2 text-gold" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 border border-white/5 bg-[#111]">
            <p className="text-gray-500 italic">More stories coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
