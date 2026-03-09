
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Calendar, Clock, Users, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const ReservationsPage: React.FC = () => {
  const { updateReservations, reservations, settings } = useApp();
  const location = useLocation();
  const specialRequest = location.state?.specialRequest || '';
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', date: '', time: '', guests: 2, note: specialRequest });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = settings.pageContent.reservations;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = {
      _subject: `New Table Reservation from ${formData.name}`,
      "Customer Name": formData.name,
      "Customer Phone": formData.phone,
      "Customer Email": formData.email,
      "Date": formData.date,
      "Time": formData.time,
      "Number of Guests": formData.guests,
      "Special Requests": formData.note
    };

    try {
      await fetch("https://formspree.io/f/mgoevezk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      // Submit to Supabase
      const { error: resError } = await supabase
        .from('reservations')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          reservation_date: formData.date,
          reservation_time: formData.time,
          guests: formData.guests,
          special_requests: formData.note,
          status: 'pending'
        });

      if (resError) throw resError;

      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to send reservation request. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-24 px-4 text-center">
        <SEO title="Reservation Confirmed" url="/reservations" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 serif text-gold">Booking Request Sent</h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">We've received your request for {formData.date} at {formData.time}. Our team will contact you shortly to confirm your table.</p>
        <button onClick={() => window.location.hash = '/'} className="px-8 py-3 bg-gold text-black font-bold uppercase tracking-widest">Return Home</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <SEO
        title="Reservations"
        description={content.subheadline || "Reserve your table at Jollof Kigali."}
        url="/reservations"
      />
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 serif">{content.headline}</h1>
          <p className="text-gray-400">{content.subheadline}</p>
        </div>

        <div className="bg-[#111] p-8 md:p-12 border border-white/5">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name *</label>
                <input required type="text" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone Number *</label>
                <input required type="text" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input type="email" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Date *</label>
                  <input required type="date" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-white" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Time *</label>
                  <select required className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold text-white" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}>
                    <option value="">Select Time</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="19:00">07:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Number of Guests *</label>
                <input required type="number" min="1" max="20" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold" value={formData.guests} onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Special Requests</label>
                <textarea className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold h-20" placeholder="Birthdays, dietary requirements..." value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })}></textarea>
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center disabled:opacity-50">
                {isSubmitting && <Loader2 className="animate-spin mr-3" size={20} />}
                Confirm Booking Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
