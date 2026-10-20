'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Calendar, Users, DollarSign, ArrowRight, Check, Lock, Loader2, Gift, CreditCard, Edit2, X, Plus, MessageSquare, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function useInView(options = { threshold: 0.1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView] as const;
}

export default function VannaOSLandingPage() {
  const [loading, setLoading] = useState(true);
  
  const [siteConfig, setSiteConfig] = useState({
    logoText: 'vanna',
    logoBadge: 'OS',
    heroHeadline: 'keep 100% of your business revenue.',
    heroSubtitle: 'The bespoke booking, CRM, and operations ecosystem built exclusively for independent therapists, nail artists, makeup pros, and barbers.',
    heroCtaText: 'Message Us on Instagram',
    sandboxHeader: 'Experience the client operating hub.',
    sandboxSubtext: 'Try out the live simulator below to manage bookings, add/edit appointments, test automated SMS reminders, and issue loyalty rewards.',
    featuresHeader: 'Crafted for independent professionals.',
    feature1Title: '0% Commission Bookings',
    feature1Desc: 'Every penny generated through your schedule goes directly into your business. No marketplace cuts.',
    feature2Title: 'Refined Organic Aesthetics',
    feature2Desc: 'A calm, professional interface designed to reflect the soothing atmosphere of your studio.',
    feature3Title: 'Robust Client Vault',
    feature3Desc: 'Secure consultation intake forms, automated SMS/email reminders, and complete client history logs.',
    pricingHeader: 'Simple, predictable pricing.',
    footerText: '© 2026 Vanna OS. All rights reserved. Built for independent practitioners.'
  });

  const [products, setProducts] = useState<any[]>([]);

  const [sandboxTab, setSandboxTab] = useState<'calendar' | 'clients' | 'comms' | 'vouchers' | 'loyalty' | 'finances'>('calendar');
  
  const [appointments, setAppointments] = useState([
    { id: 1, time: '09:00 AM', client: 'Sarah Jenkins', treatment: 'Deep Tissue Massage (90m)', status: 'Confirmed', revenue: '£95' },
    { id: 2, time: '11:30 AM', client: 'Emma Thorne', treatment: 'Gel Manicure & Nail Art (60m)', status: 'Checked In', revenue: '£55' },
    { id: 3, time: '02:00 PM', client: 'Marcus Vance', treatment: 'Skin Fade & Beard Trim (45m)', status: 'Confirmed', revenue: '£35' },
  ]);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({ time: '03:30 PM', client: '', treatment: 'Studio Appointment', revenue: '£50' });

  const [editingBooking, setEditingBooking] = useState<any | null>(null);

  const [clients, setClients] = useState([
    { id: 1, name: 'Sarah Jenkins', email: 'sarah@example.com', phone: '+44 7700 900077', spend: '£480', visits: 5, notes: 'Prefers firm pressure, allergic to lavender oil.' },
    { id: 2, name: 'Emma Thorne', email: 'emma@example.com', phone: '+44 7700 900188', spend: '£310', visits: 3, notes: 'Prefers morning slots for nail appointments.' },
    { id: 3, name: 'Marcus Vance', email: 'marcus@example.com', phone: '+44 7700 900299', spend: '£210', visits: 6, notes: 'Regular fortnightly barber client.' }
  ]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  const [commType, setCommType] = useState<'sms' | 'email'>('sms');
  const [commRecipient, setCommRecipient] = useState('Sarah Jenkins');
  const [commMessage, setCommMessage] = useState('Hi Sarah, looking forward to your Deep Tissue Massage tomorrow at 09:00 AM. Tap here to manage your booking: vanna.os/b/123');

  const [vouchers, setVouchers] = useState([
    { code: 'V-SANCTUARY-88', recipient: 'Jessica Taylor', amount: '£75', status: 'Active' },
    { code: 'V-SANCTUARY-99', recipient: 'Mark Andrews', amount: '£150', status: 'Redeemed' }
  ]);
  const [newVoucherRecipient, setNewVoucherRecipient] = useState('');
  const [newVoucherAmount, setNewVoucherAmount] = useState('£50');

  const [loyaltyCards, setLoyaltyCards] = useState([
    { client: 'Sarah Jenkins', stamps: 4, target: 6, reward: 'Free 30m Upgrade' },
    { client: 'Emma Thorne', stamps: 2, target: 6, reward: 'Free Nail Art Set' }
  ]);

  const [sandboxRef, sandboxInView] = useInView();
  const [pricingRef, pricingInView] = useInView();

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const { data: cmsData } = await supabase.from('site_cms').select('*');
      if (cmsData && cmsData.length > 0) {
        const configMap: any = {};
        cmsData.forEach((item: any) => { configMap[item.key] = item.value; });
        setSiteConfig(prev => ({ ...prev, ...configMap }));
      }

      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData && prodData.length > 0) {
        setProducts(prodData);
      }
    } catch (err) {
      console.error('Error loading public site data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.client) return;
    setAppointments([...appointments, { id: Date.now(), ...newBooking, status: 'Confirmed' }]);
    setNewBooking({ time: '03:30 PM', client: '', treatment: 'Studio Appointment', revenue: '£50' });
    setIsAddBookingOpen(false);
  };

  const handleUpdateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointments(appointments.map(a => a.id === editingBooking.id ? editingBooking : a));
    setEditingBooking(null);
  };

  const handleSaveClientDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setClients(clients.map(c => c.id === selectedClient.id ? selectedClient : c));
    setSelectedClient(null);
    alert('Client details updated successfully in CRM vault!');
  };

  const handleSendTestComm = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Test ${commType.toUpperCase()} successfully dispatched to ${commRecipient}!`);
  };

  const handleGenerateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherRecipient) return;
    const randomCode = `V-STUDIO-${Math.floor(10 + Math.random() * 90)}`;
    setVouchers([{ code: randomCode, recipient: newVoucherRecipient, amount: newVoucherAmount, status: 'Active' }, ...vouchers]);
    setNewVoucherRecipient('');
    alert(`Gift voucher ${randomCode} generated successfully!`);
  };

  const handleStampLoyalty = (index: number) => {
    const updated = [...loyaltyCards];
    if (updated[index].stamps < updated[index].target) {
      updated[index].stamps += 1;
      setLoyaltyCards(updated);
    } else {
      alert('Card is already full! Reward unlocked.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#F7F4EF', color: '#2C221E', gap: '12px', fontFamily: 'system-ui, sans-serif' }}>
        <Loader2 className="animate-spin" size={24} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading Vanna OS...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F4EF', color: '#2C221E', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>
      
      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-down {
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-up {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: floatSlow 4s ease-in-out infinite;
        }
        .transition-smooth {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      {/* Streamlined Mobile Header (Menu Removed) */}
      <header className="animate-fade-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E6E0D8', background: 'rgba(247,244,239,0.85)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 350, letterSpacing: '0.05em' }}>{siteConfig.logoText}</span>
          <span style={{ fontSize: '8px', background: '#C88A65', color: 'white', padding: '2px 6px', borderRadius: '999px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>{siteConfig.logoBadge}</span>
        </div>
        <a href="https://instagram.com/vannasoftware" target="_blank" rel="noopener noreferrer" className="transition-smooth hover:scale-105" style={{ background: '#2C221E', color: 'white', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(44,34,30,0.15)' }}>
          <MessageSquare size={14} /> Message Us
        </a>
      </header>

      {/* Hero Section */}
      <section className="animate-fade-up" style={{ padding: '3.5rem 1.25rem 2rem 1.25rem', textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
        <div className="animate-float" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#C88A6515', color: '#C88A65', padding: '4px 12px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
          <Sparkles size={12} /> Independent Studio & Practitioner OS
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
          {siteConfig.heroHeadline}
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#2C221E70', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 1.75rem auto' }}>
          {siteConfig.heroSubtitle}
        </p>
        <a href="https://instagram.com/vannasoftware" target="_blank" rel="noopener noreferrer" className="transition-smooth hover:scale-105" style={{ background: '#2C221E', color: 'white', padding: '0.85rem 1.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(44,34,30,0.15)' }}>
          <MessageSquare size={16} /> {siteConfig.heroCtaText} <ArrowRight size={16} />
        </a>
      </section>

      {/* Advanced Interactive Sandbox Simulator */}
      <section 
        id="sandbox" 
        ref={sandboxRef}
        style={{ 
          padding: '2rem 1rem', 
          maxWidth: '1050px', 
          margin: '0 auto',
          opacity: sandboxInView ? 1 : 0,
          transform: sandboxInView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 300, marginBottom: '4px' }}>{siteConfig.sandboxHeader}</h2>
          <p style={{ fontSize: '0.8rem', color: '#2C221E70' }}>{siteConfig.sandboxSubtext}</p>
        </div>

        <div className="card-box" style={{ padding: 0, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E6E0D8' }}>
          
          <div style={{ display: 'flex', borderBottom: '1px solid #E6E0D8', background: '#F2ECE4', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {[
              { id: 'calendar', label: 'Schedule', icon: Calendar },
              { id: 'clients', label: 'CRM Vault', icon: Users },
              { id: 'comms', label: 'Comms', icon: MessageSquare },
              { id: 'vouchers', label: 'Vouchers', icon: Gift },
              { id: 'loyalty', label: 'Loyalty', icon: CreditCard },
              { id: 'finances', label: 'Analytics', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = sandboxTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSandboxTab(tab.id as any)}
                  className="transition-smooth"
                  style={{
                    flexShrink: 0, padding: '0.75rem 1rem', background: isActive ? '#FFFFFF' : 'transparent', border: 'none',
                    borderBottom: isActive ? '2px solid #C88A65' : 'none', fontSize: '0.75rem', fontWeight: 600,
                    color: isActive ? '#2C221E' : '#2C221E60', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ padding: '1.25rem' }}>
            {sandboxTab === 'calendar' && (
              <div className="animate-fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>Today's Live Schedule</h3>
                  <button onClick={() => setIsAddBookingOpen(true)} style={{ background: '#2C221E', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Add Booking
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {appointments.map(app => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F7F4EF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E6E0D8', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C88A65' }}>{app.time}</span>
                        <div>
                          <strong style={{ fontSize: '0.8rem', display: 'block' }}>{app.client}</strong>
                          <span style={{ fontSize: '0.7rem', color: '#2C221E70' }}>{app.treatment}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span 
                          onClick={() => {
                            const nextStatus = app.status === 'Confirmed' ? 'Checked In' : app.status === 'Checked In' ? 'Completed' : 'Confirmed';
                            setAppointments(appointments.map(a => a.id === app.id ? {...a, status: nextStatus} : a));
                          }}
                          style={{ fontSize: '0.7rem', background: '#C88A6515', color: '#C88A65', padding: '3px 8px', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          {app.status}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#047857' }}>{app.revenue}</span>
                        <button onClick={() => setEditingBooking({...app})} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C221E70' }}>
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sandboxTab === 'clients' && (
              <div className="animate-fade-up">
                <h3 style={{ fontSize: '0.9rem', fontWeight: 500, margin: '0 0 0.75rem 0' }}>Client Directory (Click to Edit)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  {clients.map(c => (
                    <div key={c.id} onClick={() => setSelectedClient({...c})} style={{ background: '#F7F4EF', padding: '1rem', borderRadius: '10px', border: '1px solid #E6E0D8', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '0.85rem' }}>{c.name}</strong>
                        <Edit2 size={14} color="#C88A65" />
                      </div>
                      <p style={{ fontSize: '0.7rem', color: '#2C221E70', margin: '2px 0' }}>{c.email}</p>
                      <div style={{ marginTop: '6px', fontSize: '0.7rem', fontWeight: 600, color: '#047857' }}>Spend: {c.spend} ({c.visits} visits)</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sandboxTab === 'comms' && (
              <div className="animate-fade-up">
                <h3 style={{ fontSize: '0.9rem', fontWeight: 500, margin: '0 0 0.75rem 0' }}>Automated SMS/Email Dispatcher</h3>
                <form onSubmit={handleSendTestComm} style={{ background: '#F7F4EF', padding: '1rem', borderRadius: '10px', border: '1px solid #E6E0D8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="commType" checked={commType === 'sms'} onChange={() => setCommType('sms')} /> SMS
                    </label>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="commType" checked={commType === 'email'} onChange={() => setCommType('email')} /> Email
                    </label>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Recipient Client</label>
                    <select value={commRecipient} onChange={e => setCommRecipient(e.target.value)} style={{ padding: '6px', fontSize: '0.75rem', width: '100%' }}>
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Message Preview</label>
                    <textarea rows={2} value={commMessage} onChange={e => setCommMessage(e.target.value)} style={{ background: '#FFFFFF', width: '100%', padding: '6px', fontSize: '0.75rem' }} />
                  </div>
                  <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' }}>
                    <Send size={12} /> Send Test
                  </button>
                </form>
              </div>
            )}

            {sandboxTab === 'vouchers' && (
              <div className="animate-fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>Gift Vouchers</h3>
                  <form onSubmit={handleGenerateVoucher} style={{ display: 'flex', gap: '6px', width: '100%', maxWidth: '320px' }}>
                    <input type="text" placeholder="Recipient..." value={newVoucherRecipient} onChange={e => setNewVoucherRecipient(e.target.value)} required style={{ padding: '6px', fontSize: '0.75rem', flex: 1 }} />
                    <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Generate</button>
                  </form>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {vouchers.map((v, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F7F4EF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E6E0D8' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{v.code} ({v.recipient})</span>
                      <strong style={{ fontSize: '0.8rem', color: '#047857' }}>{v.amount}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sandboxTab === 'loyalty' && (
              <div className="animate-fade-up">
                <h3 style={{ fontSize: '0.9rem', fontWeight: 500, margin: '0 0 0.75rem 0' }}>Client Loyalty Cards</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  {loyaltyCards.map((card, i) => (
                    <div key={i} style={{ background: '#F7F4EF', padding: '1rem', borderRadius: '10px', border: '1px solid #E6E0D8' }}>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>{card.client}</strong>
                      <div style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
                        {Array.from({ length: card.target }).map((_, sIdx) => (
                          <div key={sIdx} style={{ width: '22px', height: '22px', borderRadius: '50%', background: sIdx < card.stamps ? '#C88A65' : '#E6E0D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '9px', fontWeight: 700 }}>
                            {sIdx < card.stamps ? '✓' : sIdx + 1}
                          </div>
                        ))}
                      </div>
                      <button onClick={() => handleStampLoyalty(i)} style={{ width: '100%', background: '#2C221E', color: 'white', border: 'none', padding: '4px', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer' }}>
                        Add Stamp
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sandboxTab === 'finances' && (
              <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', textAlign: 'center' }}>
                <div style={{ background: '#F7F4EF', padding: '1rem', borderRadius: '10px', border: '1px solid #E6E0D8' }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#C88A65', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Gross Revenue</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 300 }}>£280</span>
                </div>
                <div style={{ background: '#F7F4EF', padding: '1rem', borderRadius: '10px', border: '1px solid #E6E0D8' }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#C88A65', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Commission</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 300, color: '#047857' }}>£0.00 (0%)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Section */}
      <section 
        id="pricing" 
        ref={pricingRef}
        style={{ 
          padding: '2.5rem 1rem', 
          maxWidth: '1050px', 
          margin: '0 auto',
          opacity: pricingInView ? 1 : 0,
          transform: pricingInView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '4px' }}>{siteConfig.pricingHeader}</h2>
          <p style={{ fontSize: '0.8rem', color: '#2C221E70' }}>Message us on Instagram to secure your setup.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {products.map((p) => (
            <div key={p.id} className="card-box transition-smooth hover:-translate-y-1 hover:shadow-md" style={{ background: '#FFFFFF', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #E6E0D8' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 400, marginBottom: '4px' }}>{p.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#2C221E70', marginBottom: '1rem' }}>{p.description}</p>
                <div style={{ fontSize: '2rem', fontWeight: 300, color: '#C88A65', marginBottom: '2px' }}>
                  £{p.mrr}<span style={{ fontSize: '0.75rem', color: '#2C221E70' }}>/mo</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#2C221E60', marginBottom: '1.25rem' }}>+£{p.setup_fee} setup</div>
                <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.75rem', color: '#2C221E80', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {p.features?.map((feat: string, i: number) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <a href="https://instagram.com/vannasoftware" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: '#2C221E', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>
                  Message Us on Instagram
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals for Booking & Client Editing */}
      {isAddBookingOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="animate-fade-up" style={{ background: '#FFFFFF', width: '100%', maxWidth: '400px', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 400, margin: 0 }}>Add Booking</h3>
              <button onClick={() => setIsAddBookingOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Client Name *</label>
                <input type="text" placeholder="Jessica Miller" value={newBooking.client} onChange={e => setNewBooking({...newBooking, client: e.target.value})} required style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Time *</label>
                <input type="text" value={newBooking.time} onChange={e => setNewBooking({...newBooking, time: e.target.value})} required style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Treatment</label>
                <input type="text" value={newBooking.treatment} onChange={e => setNewBooking({...newBooking, treatment: e.target.value})} required style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Price (£)</label>
                <input type="text" value={newBooking.revenue} onChange={e => setNewBooking({...newBooking, revenue: e.target.value})} required style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', padding: '0.65rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}>Confirm</button>
            </form>
          </div>
        </div>
      )}

      {editingBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="animate-fade-up" style={{ background: '#FFFFFF', width: '100%', maxWidth: '400px', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 400, margin: 0 }}>Edit Booking</h3>
              <button onClick={() => setEditingBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Client</label>
                <input type="text" value={editingBooking.client} onChange={e => setEditingBooking({...editingBooking, client: e.target.value})} required style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Time</label>
                <input type="text" value={editingBooking.time} onChange={e => setEditingBooking({...editingBooking, time: e.target.value})} required style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Treatment</label>
                <input type="text" value={editingBooking.treatment} onChange={e => setEditingBooking({...editingBooking, treatment: e.target.value})} required style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', padding: '0.65rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}>Save</button>
            </form>
          </div>
        </div>
      )}

      {selectedClient && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="animate-fade-up" style={{ background: '#FFFFFF', width: '100%', maxWidth: '400px', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 400, margin: 0 }}>Edit Client</h3>
              <button onClick={() => setSelectedClient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveClientDetails} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Name</label>
                <input type="text" value={selectedClient.name} onChange={e => setSelectedClient({...selectedClient, name: e.target.value})} required style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Email</label>
                <input type="email" value={selectedClient.email} onChange={e => setSelectedClient({...selectedClient, email: e.target.value})} style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Notes</label>
                <textarea rows={2} value={selectedClient.notes} onChange={e => setSelectedClient({...selectedClient, notes: e.target.value})} style={{ background: '#F7F4EF', width: '100%', padding: '6px', fontSize: '0.75rem' }} />
              </div>
              <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', padding: '0.65rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}>Save</button>
            </form>
          </div>
        </div>
      )}

      <footer style={{ padding: '2rem 1rem', borderTop: '1px solid #E6E0D8', textAlign: 'center', fontSize: '0.75rem', color: '#2C221E60' }}>
        <p style={{ margin: 0 }}>{siteConfig.footerText}</p>
      </footer>
    </div>
  );
}