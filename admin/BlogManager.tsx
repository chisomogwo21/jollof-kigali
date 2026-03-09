
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Plus, Edit, Trash2, Calendar, User } from 'lucide-react';
import { BlogPost } from '../types';
import ImageUpload from './components/ImageUpload';
import { supabase } from '../lib/supabase';

const BlogManager: React.FC = () => {
  const { posts, updatePosts } = useApp();
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) {
        alert(`Failed to delete: ${error.message}`);
        return;
      }
      updatePosts(posts.filter(p => p.id !== id));
    }
  };

  const handleSave = async () => {
    if (!editingPost) return;

    try {
      if (editingPost.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: editingPost.title,
            excerpt: editingPost.excerpt,
            author: editingPost.author,
            image_url: editingPost.image,
          })
          .eq('id', editingPost.id);

        if (error) throw error;

        updatePosts(posts.map(p => p.id === editingPost.id ? { ...p, ...editingPost } as BlogPost : p));
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{
            title: editingPost.title,
            excerpt: editingPost.excerpt,
            author: editingPost.author,
            image_url: editingPost.image,
          }])
          .select()
          .single();

        if (error) throw error;

        const newPost: BlogPost = {
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          author: data.author,
          image: data.image_url,
          date: data.created_at
        };

        updatePosts([newPost, ...posts]);
      }
      setEditingPost(null);
    } catch (err: any) {
      alert(`Failed to save post: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold serif text-gold">Kitchen Table (Blog)</h1>
        <button
          onClick={() => setEditingPost({ title: '', excerpt: '', author: 'Management', image: '' })}
          className="flex items-center space-x-2 bg-gold text-black px-6 py-2 rounded-sm font-bold uppercase tracking-widest text-xs"
        >
          <Plus size={16} /> <span>New Story</span>
        </button>
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 p-8 w-full max-w-2xl space-y-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl serif text-gold mb-6">{editingPost.id ? 'Edit Story' : 'New Story'}</h2>

            <ImageUpload
              label="Cover Image"
              value={editingPost.image || ''}
              onChange={(val) => setEditingPost({ ...editingPost, image: val })}
            />

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Story Title</label>
                <input
                  placeholder="e.g. The Perfect Suya"
                  className="w-full bg-black border border-white/10 p-3 outline-none focus:border-gold"
                  value={editingPost.title}
                  onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Author</label>
                <input
                  placeholder="Author name"
                  className="w-full bg-black border border-white/10 p-3 outline-none focus:border-gold"
                  value={editingPost.author}
                  onChange={e => setEditingPost({ ...editingPost, author: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Excerpt / Content Preview</label>
                <textarea
                  placeholder="Write a brief intro or the full story..."
                  className="w-full bg-black border border-white/10 p-3 outline-none focus:border-gold h-48"
                  value={editingPost.excerpt}
                  onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
              <button onClick={() => setEditingPost(null)} className="px-6 py-2 text-gray-400 uppercase font-bold tracking-widest text-xs hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-10 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-lg">
                Publish Story
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-black/40 border border-white/5 p-6 rounded-sm flex gap-6 hover:border-gold/30 transition-all group">
            <img src={post.image} className="w-24 h-24 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt="" />
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gold serif text-lg mb-1">{post.title}</h3>
                <div className="flex items-center space-x-4 text-[9px] uppercase tracking-widest text-gray-500">
                  <span className="flex items-center"><Calendar size={10} className="mr-1" /> {new Date(post.date).toLocaleDateString()}</span>
                  <span className="flex items-center"><User size={10} className="mr-1" /> {post.author}</span>
                </div>
                <p className="text-gray-500 text-[11px] line-clamp-2 mt-2 leading-relaxed">{post.excerpt}</p>
              </div>
              <div className="flex space-x-4 mt-4">
                <button onClick={() => setEditingPost(post)} className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white flex items-center"><Edit size={12} className="mr-1" /> Edit</button>
                <button onClick={() => handleDelete(post.id)} className="text-[10px] uppercase font-bold tracking-widest text-red-900 hover:text-red-500 flex items-center"><Trash2 size={12} className="mr-1" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="col-span-full p-20 text-center border border-dashed border-white/10 text-gray-600 uppercase tracking-widest text-xs font-bold">No stories published.</div>}
      </div>
    </div>
  );
};

export default BlogManager;
