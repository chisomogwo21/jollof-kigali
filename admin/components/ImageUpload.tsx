
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('jollof_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('jollof_images')
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`);
      // Fallback to local data URL if upload fails (for local testing without storage setup)
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">{label}</label>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative aspect-video rounded-sm border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 overflow-hidden
          ${isDragging ? 'border-gold bg-gold/5' : 'border-white/10 bg-black hover:border-white/20'}
          ${value ? 'border-solid' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center text-gold">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Processing...</span>
          </div>
        ) : value ? (
          <>
            <img src={value} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex flex-col items-center text-white">
                <Upload size={20} className="mb-2" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Replace Image</span>
              </div>
            </div>
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors z-10"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <ImageIcon size={24} />
            </div>
            <p className="text-xs font-bold mb-1 text-white uppercase tracking-widest">Click or Drag Image</p>
            <p className="text-[10px] tracking-tight">Support: JPG, PNG, WEBP (Max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
