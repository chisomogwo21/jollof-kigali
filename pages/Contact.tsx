
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const { settings } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const content = settings.pageContent.contact;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch("https://formspree.io/f/mgoevezk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `New Website Contact Inquiry from ${data.name}`,
          ...data
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to send message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-24 px-4 text-center min-h-screen bg-[#0A0A0A]">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 serif text-gold">Message Received</h1>
        <p className="text-xl text-gray-400 mb-10">We've received your inquiry and will get back to you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="px-8 py-3 border border-gold text-gold font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all">Send Another Message</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 serif">
              {content.headline.split(' ').map((word, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? <span className="text-gold italic">{word}</span> : word + ' '}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-gray-400 text-lg mb-12 font-light max-w-md">
              {content.subheadline}
            </p>

            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-gold shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Location</h4>
                  <p className="text-white font-medium">{settings.contact.address}</p>
                  <p className="text-gray-500">Kigali, Rwanda</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-gold shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Call Us</h4>
                  <p className="text-white font-medium">{settings.contact.phone}</p>
                  <p className="text-gray-500">Available during opening hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-gold shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Email</h4>
                  <p className="text-white font-medium">{settings.contact.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] p-8 md:p-12 border border-white/5 relative shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Name</label>
                  <input name="name" required type="text" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Email</label>
                  <input name="email" required type="email" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold transition-colors text-white" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Subject</label>
                <input name="subject" required type="text" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold transition-colors text-white" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Message</label>
                <textarea name="message" required className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold transition-colors text-white h-40"></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin mr-3" size={16} /> : <Send size={16} className="mr-3" />} 
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
