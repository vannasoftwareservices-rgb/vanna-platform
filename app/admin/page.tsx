'use client';

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, FileText, Globe, Plus, Trash2, Edit3, Save, ArrowLeft, Package, Loader2, X, Upload, MessageSquare, Phone, Mail, Clock, Layers, Lock, Sparkles, Check, Menu } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function VannaOSMasterHubSpot() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [currentTab, setActiveTab] = useState<'pipeline' | 'contacts' | 'products' | 'cms' | 'finances' | 'contracts'>('pipeline');
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mobile Burger Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  // Financial Filter State
  const [financeFilter, setFinanceFilter] = useState<'this-month' | 'last-month' | 'q3' | 'ytd' | 'all'>('this-month');

  // Pipeline Stages
  const pipelineStages = [
    'Prospect',
    'Demo Booked',
    'Proposal Sent',
    'Trial',
    'Onboarding',
    'Customer'
  ];

  // Master List of Features (from provided reference)
  const masterFeatureList = [
    'Public-Facing Booking & Enquiry Website',
    'Core Treatment CMS (Menus, Durations, Pricing)',
    'Client CRM Database & Spend Tracking',
    'Digital Contact & Enquiry Form',
    'Hosting, SSL Security & Core Maintenance',
    'Automated Review & Reputation Engine',
    'Dynamic Form Builder (Intake & Consultation Forms)',
    'Digital Loyalty Programme Ecosystem',
    'Photo Gallery CMS',
    'Marketing Campaign Landing Pages (Smart CRM Matching)',
    'Automated Consent & Unsubscribe System',
    'Custom Email Templates & Notifications',
    'Priority Support & Fast-Track Onboarding'
  ];

  // App Data States
  const [products, setProducts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  // Product Builder / Editor States
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [newProd, setNewProd] = useState({
    name: '',
    mrr: '',
    setup_fee: '',
    description: '',
    features: [] as string[]
  });

  // Form State for Adding a New Deal
  const [dealForm, setDealForm] = useState({
    company_id: '',
    new_business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    source: 'Outreach (Instagram)',
    deal_name: '',
    product_tier: '',
    mrr_value: 0,
    setup_value: 0,
    stage: 'Prospect',
    contact_type: 'Pipeline Deal',
    override_mrr: false,
    override_setup: false,
    pricing_reason: ''
  });

  const [newNote, setNewNote] = useState({ communication_type: 'Call', content: '' });

  // Complete Web Page Copy CMS States
  const [siteConfig, setSiteConfig] = useState({
    logoText: 'vanna',
    logoBadge: 'OS',
    heroHeadline: 'keep 100% of your salon revenue.',
    heroSubtitle: 'The bespoke booking, CRM, and operations ecosystem built exclusively for independent wellness spaces.',
    heroCtaText: 'Test Interactive Backend',
    sandboxHeader: 'Experience the client operating hub.',
    sandboxSubtext: 'Try out the live simulator below to see how practitioners manage client records, treatments, and revenue reports.',
    featuresHeader: 'Crafted for independent practitioners.',
    feature1Title: '0% Commission Bookings',
    feature1Desc: 'Every penny generated through your schedule goes directly into your business. No marketplace cuts.',
    feature2Title: 'Refined Organic Aesthetics',
    feature2Desc: 'A calm, professional interface designed to reflect the soothing atmosphere of your physical sanctuary.',
    feature3Title: 'Robust Client Vault',
    feature3Desc: 'Secure consultation intake forms, automated SMS/email reminders, and complete client history logs.',
    pricingHeader: 'Simple, predictable pricing.',
    footerText: '© 2026 Vanna OS. All rights reserved. Built for independent wellness spaces.'
  });
  const [savingCms, setSavingCms] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'admin' && passwordInput === 'sanctuary2026') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid username or password.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHubSpotData();
    }
  }, [isAuthenticated]);

  const fetchHubSpotData = async () => {
    setLoading(true);
    try {
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData && prodData.length > 0) {
        setProducts(prodData);
        setDealForm(prev => ({
          ...prev,
          product_tier: prodData[0].name,
          mrr_value: prodData[0].mrr,
          setup_value: prodData[0].setup_fee
        }));
      }

      const { data: compData } = await supabase.from('companies').select('*');
      if (compData) setCompanies(compData);

      const { data: dealData } = await supabase.from('deals').select('*, companies(business_name, contact_name, email, phone)');
      if (dealData) setDeals(dealData);

      const { data: docData } = await supabase.from('contracts').select('*');
      if (docData) setDocuments(docData);

      const { data: cmsData } = await supabase.from('site_cms').select('*');
      if (cmsData && cmsData.length > 0) {
        const configMap: any = {};
        cmsData.forEach((item: any) => { configMap[item.key] = item.value; });
        setSiteConfig(prev => ({ ...prev, ...configMap }));
      }
    } catch (err) {
      console.error('Error fetching HubSpot-style data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCms(true);
    try {
      const entries = Object.entries(siteConfig);
      for (const [key, value] of entries) {
        await supabase.from('site_cms').upsert({ key, value });
      }
      alert('All website copy published successfully across the public page!');
    } catch (err: any) {
      alert('Error saving CMS copy: ' + err.message);
    } finally {
      setSavingCms(false);
    }
  };

  const handleProductChange = (tierName: string) => {
    const match = products.find(p => p.name === tierName);
    if (match) {
      setDealForm(prev => ({
        ...prev,
        product_tier: tierName,
        mrr_value: prev.override_mrr ? prev.mrr_value : match.mrr,
        setup_value: prev.override_setup ? prev.setup_value : match.setup_fee
      }));
    }
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.mrr) {
      alert('Please enter a product title and monthly price.');
      return;
    }

    try {
      const payload = {
        name: newProd.name,
        mrr: Number(newProd.mrr),
        setup_fee: Number(newProd.setup_fee) || 299,
        description: newProd.description || 'Bespoke independent salon ecosystem package.',
        features: newProd.features
      };

      if (editingProductId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProductId);
        if (error) throw error;
        setProducts(products.map(p => p.id === editingProductId ? { ...p, ...payload } : p));
        setEditingProductId(null);
        alert('Product tier updated successfully!');
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select();
        if (error) throw error;
        if (data) {
          setProducts([...products, data[0]]);
          alert('Product tier created and published successfully!');
        }
      }

      setNewProd({ name: '', mrr: '', setup_fee: '', description: '', features: [] });
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleStartEditProduct = (prod: any) => {
    setEditingProductId(prod.id);
    setNewProd({
      name: prod.name,
      mrr: prod.mrr,
      setup_fee: prod.setup_fee,
      description: prod.description || '',
      features: prod.features || []
    });
  };

  const handleDeleteProduct = async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setProducts(products.filter(p => p.id !== id));
  };

  const toggleFeatureSelection = (feature: string) => {
    if (newProd.features.includes(feature)) {
      setNewProd({ ...newProd, features: newProd.features.filter(f => f !== feature) });
    } else {
      setNewProd({ ...newProd, features: [...newProd.features, feature] });
    }
  };

  const handleAddDealSubmit = async (e: React.FormEvent, targetCompanyId?: number) => {
    e.preventDefault();
    
    let targetId = targetCompanyId || dealForm.company_id;
    let companyName = dealForm.new_business_name;

    if ((dealForm.override_mrr || dealForm.override_setup) && !dealForm.pricing_reason.trim()) {
      alert('Please provide a reason for the custom pricing override.');
      return;
    }

    try {
      if (!targetId && companyName) {
        const { data: newComp, error: compErr } = await supabase.from('companies').insert([{
          business_name: companyName,
          contact_name: dealForm.contact_name,
          email: dealForm.email,
          phone: dealForm.phone,
          source: dealForm.source
        }]).select().single();

        if (compErr) throw compErr;
        targetId = newComp.id;
        setCompanies([...companies, newComp]);
      }

      if (!targetId) {
        alert('Please select or create an associated company for this deal.');
        return;
      }

      const newDealPayload = {
        company_id: Number(targetId),
        deal_name: dealForm.deal_name || `${companyName || 'Client'} - Subscription`,
        stage: dealForm.stage,
        product_tier: dealForm.product_tier,
        mrr_value: Number(dealForm.mrr_value),
        setup_value: Number(dealForm.setup_value),
        contact_type: dealForm.contact_type,
        pricing_reason: dealForm.pricing_reason || null
      };

      const { data: insertedDeal, error: dealErr } = await supabase.from('deals').insert([newDealPayload]).select('*, companies(business_name, contact_name, email, phone)').single();
      if (dealErr) throw dealErr;

      setDeals([...deals, insertedDeal]);
      setIsDealModalOpen(false);
      setDealForm({
        company_id: '',
        new_business_name: '',
        contact_name: '',
        email: '',
        phone: '',
        source: 'Outreach (Instagram)',
        deal_name: '',
        product_tier: products[0]?.name || '',
        mrr_value: products[0]?.mrr || 0,
        setup_value: products[0]?.setup_fee || 0,
        stage: 'Prospect',
        contact_type: 'Pipeline Deal',
        override_mrr: false,
        override_setup: false,
        pricing_reason: ''
      });
    } catch (err: any) {
      alert('Error adding deal: ' + err.message);
    }
  };

  const handleSaveCompanyEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('companies')
      .update({
        business_name: selectedCompany.business_name,
        contact_name: selectedCompany.contact_name,
        email: selectedCompany.email,
        phone: selectedCompany.phone
      })
      .eq('id', selectedCompany.id);

    if (error) {
      alert('Error updating company: ' + error.message);
    } else {
      setCompanies(companies.map(c => c.id === selectedCompany.id ? selectedCompany : c));
      setIsEditingCompany(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.content) return;
    const notePayload = {
      id: Date.now(),
      company_id: selectedCompany.id,
      communication_type: newNote.communication_type,
      content: newNote.content,
      date: new Date().toLocaleString()
    };
    setNotes([notePayload, ...notes]);
    setNewNote({ communication_type: 'Call', content: '' });
  };

  const [contractForm, setContractForm] = useState({ company_name: '', title: '', file_size: '1.2 MB' });

  const handleUploadContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractForm.company_name || !contractForm.title) return;
    const { data, error } = await supabase.from('contracts').insert([contractForm]).select();
    if (!error && data) {
      setDocuments([...documents, data[0]]);
      setContractForm({ company_name: '', title: '', file_size: '1.2 MB' });
      setIsContractModalOpen(false);
    }
  };

  const handleDeleteDoc = async (id: number) => {
    const { error } = await supabase.from('contracts').delete().eq('id', id);
    if (!error) setDocuments(documents.filter(d => d.id !== id));
  };

  const activeCustomerDeals = deals.filter(d => d.stage === 'Customer');
  const activePortfolioMrr = activeCustomerDeals.reduce((acc, d) => acc + Number(d.mrr_value || 0), 0);

  const getFilteredFinancials = () => {
    let multiplier = 1;
    let label = 'This Month (October 2026)';
    if (financeFilter === 'last-month') { label = 'Last Month (September 2026)'; multiplier = 0.92; }
    else if (financeFilter === 'q3') { label = 'Q3 2026 (Jul - Sep)'; multiplier = 2.85; }
    else if (financeFilter === 'ytd') { label = 'Year to Date 2026'; multiplier = 9.4; }
    else if (financeFilter === 'all') { label = 'All-Time Cumulative'; multiplier = 14.2; }

    const filteredMrr = Math.round(activePortfolioMrr * (financeFilter === 'this-month' ? 1 : 0.95));
    const cumulativeRevenue = Math.round(activePortfolioMrr * multiplier + deals.reduce((acc, d) => acc + Number(d.setup_value || 0), 0));

    return { label, filteredMrr, cumulativeRevenue, activeCount: activeCustomerDeals.length };
  };

  const finData = getFilteredFinancials();

  // SECURE LOGIN GATE
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#F7F4EF] text-[#2C221E] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E6E0D8] shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#F7F4EF] border border-[#E6E0D8] rounded-2xl flex items-center justify-center mx-auto text-[#C88A65]">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl">Backend Admin Login</h1>
            <p className="text-xs text-[#2C221E70]">Enter your username and password to access the Vanna OS Master Hub.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold mb-1">Username</label>
              <input type="text" required value={usernameInput} onChange={e => setUsernameInput(e.target.value)} placeholder="admin" className="w-full p-3 border border-[#E6E0D8] rounded-xl text-sm bg-[#F7F4EF] outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold mb-1">Password</label>
              <input type="password" required value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="••••••••••••" className="w-full p-3 border border-[#E6E0D8] rounded-xl text-sm bg-[#F7F4EF] outline-none" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#2C221E] text-white text-xs uppercase tracking-widest rounded-full font-semibold hover:bg-[#3D302B] transition">
              Sign In to Backend Hub
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#F7F4EF', color: '#2C221E', gap: '12px', fontFamily: 'system-ui, sans-serif' }}>
        <Loader2 className="animate-spin" size={24} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading HubSpot Workspace...</span>
      </div>
    );
  }

  const navItems = [
    { id: 'pipeline', label: 'Pipeline & Deals', icon: Plus },
    { id: 'contacts', label: 'Company CRM Directory', icon: Users },
    { id: 'products', label: 'Products & Pricing Catalog', icon: Package },
    { id: 'cms', label: 'Global Website CMS', icon: Globe },
    { id: 'finances', label: 'MRR & Reports', icon: DollarSign },
    { id: 'contracts', label: 'Contracts & SLA Vault', icon: FileText },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F7F4EF', color: '#2C221E', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      
      {/* Mobile Top Navbar with Burger Menu */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E6E0D8', position: 'sticky', top: 0, zIndex: 100 }} className="flex md:hidden">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 350, letterSpacing: '0.05em' }}>vanna</span>
          <span style={{ fontSize: '8px', background: '#C88A65', color: 'white', padding: '2px 6px', borderRadius: '999px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>OS Hub</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: '#2C221E', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />} Menu
        </button>
      </header>

      {/* Mobile Burger Menu Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E6E0D8', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px', position: 'sticky', top: '61px', zIndex: 99, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} className="flex md:hidden">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSelectedCompany(null); setIsEditingCompany(false); setIsMobileMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: 'none', background: isActive ? '#2C221E' : '#F7F4EF', color: isActive ? '#FFFFFF' : '#2C221E',
                  fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, width: '100%' }}>
        {/* Desktop Sidebar Navigation */}
        <aside style={{ width: '280px', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', borderRight: '1px solid #E6E0D8', padding: '2rem', display: 'none', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }} className="md:flex">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 350, letterSpacing: '0.05em' }}>vanna</span>
              <span style={{ fontSize: '9px', background: '#C88A65', color: 'white', padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>OS</span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSelectedCompany(null); setIsEditingCompany(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '1rem',
                      border: 'none',
                      background: isActive ? '#2C221E' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#2C221E',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(44,34,30,0.1)' : 'none'
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="card-box" style={{ margin: 0, padding: '1.25rem', background: '#FFFFFF' }}>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Active Portfolio MRR</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 300 }}>£{activePortfolioMrr} <span style={{ fontSize: '0.75rem', color: '#2C221E60' }}>/mo</span></span>
            <span style={{ fontSize: '10px', color: '#2C221E60', display: 'block', marginTop: '2px' }}>({activeCustomerDeals.length} active customer deals)</span>
          </div>
        </aside>

        {/* Main Workspace */}
        <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2.5rem)', maxWidth: '1320px', margin: '0 auto', overflowY: 'auto', width: '100%' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E6E0D8', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, textTransform: 'capitalize', margin: 0 }}>
                {selectedCompany ? `Company Profile: ${selectedCompany.business_name}` : currentTab.replace('-', ' ')}
              </h1>
              <p style={{ fontSize: '0.8rem', color: '#2C221E70', margin: '4px 0 0 0' }}>Multi-Deal HubSpot CRM Architecture</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {currentTab === 'pipeline' && !selectedCompany && (
                <button 
                  onClick={() => setIsDealModalOpen(true)}
                  style={{ background: '#2C221E', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={16} /> Add New Deal
                </button>
              )}
              {currentTab === 'contracts' && !selectedCompany && (
                <button 
                  onClick={() => setIsContractModalOpen(true)}
                  style={{ background: '#2C221E', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Upload size={16} /> Upload Contract
                </button>
              )}
            </div>
          </header>

          {/* COMPANY PROFILE & MULTI-DEAL HUB VIEW */}
          {selectedCompany ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => { setSelectedCompany(null); setIsEditingCompany(false); }} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#C88A65', padding: 0 }}
                >
                  <ArrowLeft size={16} /> Back to Directory
                </button>

                <button 
                  onClick={() => setIsEditingCompany(!isEditingCompany)} 
                  style={{ background: '#2C221E', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={14} /> {isEditingCompany ? 'Cancel Editing' : 'Edit Company'}
                </button>
              </div>

              {isEditingCompany ? (
                <form onSubmit={handleSaveCompanyEdit} className="card-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Business Name</label>
                    <input type="text" value={selectedCompany.business_name} onChange={e => setSelectedCompany({...selectedCompany, business_name: e.target.value})} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Contact Person</label>
                    <input type="text" value={selectedCompany.contact_name} onChange={e => setSelectedCompany({...selectedCompany, contact_name: e.target.value})} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email</label>
                    <input type="email" value={selectedCompany.email} onChange={e => setSelectedCompany({...selectedCompany, email: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone</label>
                    <input type="text" value={selectedCompany.phone} onChange={e => setSelectedCompany({...selectedCompany, phone: e.target.value})} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                    <button type="submit" style={{ background: '#047857', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Save size={16} /> Save Company Details
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="card-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65' }}>Company Profile</span>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 400, margin: '4px 0 1rem 0' }}>{selectedCompany.business_name}</h2>
                      <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', color: '#2C221E80' }}>
                        <p style={{ margin: 0 }}><strong>Owner/Contact:</strong> {selectedCompany.contact_name}</p>
                        <p style={{ margin: 0 }}><strong>Email:</strong> {selectedCompany.email}</p>
                        <p style={{ margin: 0 }}><strong>Phone:</strong> {selectedCompany.phone}</p>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65' }}>Associated Deals Hub ({deals.filter(d => d.company_id === selectedCompany.id).length})</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                        {deals.filter(d => d.company_id === selectedCompany.id).map(deal => (
                          <div key={deal.id} style={{ background: '#F7F4EF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E6E0D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>{deal.deal_name}</span>
                              <span style={{ fontSize: '7px', color: '#C88A65', background: '#C88A6515', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{deal.stage}</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#047857' }}>£{deal.mrr_value}/mo</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Associated Deals & Add Deal Button */}
                  <div className="card-box" style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={16} /> Deals & Renewals for {selectedCompany.business_name}
                      </h3>
                      <button 
                        onClick={() => {
                          setDealForm(prev => ({ ...prev, company_id: selectedCompany.id, new_business_name: selectedCompany.business_name }));
                          setIsDealModalOpen(true);
                        }}
                        style={{ background: '#2C221E', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={14} /> Add Deal / Renewal
                      </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', minWidth: '480px' }}>
                      <thead>
                        <tr style={{ background: '#F2ECE4', color: '#2C221E70', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>Deal Name</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Stage</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Tier</th>
                          <th style={{ padding: '0.75rem 1rem' }}>MRR</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Setup</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deals.filter(d => d.company_id === selectedCompany.id).map(d => (
                          <tr key={d.id} style={{ borderTop: '1px solid #E6E0D8' }}>
                            <td style={{ padding: '1rem', fontWeight: 500 }}>{d.deal_name}</td>
                            <td style={{ padding: '1rem' }}><span style={{ color: '#C88A65', fontWeight: 600 }}>{d.stage}</span></td>
                            <td style={{ padding: '1rem', color: '#2C221E70' }}>{d.product_tier}</td>
                            <td style={{ padding: '1rem', fontWeight: 600, color: '#047857' }}>£{d.mrr_value}/mo</td>
                            <td style={{ padding: '1rem' }}>£{d.setup_value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Communication Notes & Documents */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    <div className="card-box" style={{ margin: 0 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={16} /> Communication Logs
                      </h3>
                      <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                        <select value={newNote.communication_type} onChange={e => setNewNote({...newNote, communication_type: e.target.value})}>
                          <option value="Call">Call</option>
                          <option value="Missed Call">Missed Call</option>
                          <option value="Email">Email</option>
                          <option value="WhatsApp">WhatsApp</option>
                        </select>
                        <textarea rows={2} placeholder="Write note..." value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} required style={{ background: '#F7F4EF' }} />
                        <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', alignSelf: 'flex-end' }}>Add Note</button>
                      </form>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {notes.filter(n => n.company_id === selectedCompany.id).map(n => (
                          <div key={n.id} style={{ background: '#F7F4EF', padding: '8px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
                            <strong>{n.communication_type}</strong> ({n.date}): {n.content}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card-box" style={{ margin: 0 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} /> Associated Documents
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {documents.filter(d => d.company_name === selectedCompany.business_name).map(doc => (
                          <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#F7F4EF', borderRadius: '6px', fontSize: '0.75rem', alignItems: 'center' }}>
                            <span>{doc.title}</span>
                            <button onClick={() => handleDeleteDoc(doc.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <>
              {/* TAB 1: PIPELINE */}
              {currentTab === 'pipeline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="card-box" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65', fontWeight: 700, margin: '0 0 1rem 0' }}>Pipeline Revenue by Stage</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                      {pipelineStages.map(stage => {
                        const stageDeals = deals.filter(d => (d.stage || 'Prospect') === stage);
                        const stageMrr = stageDeals.reduce((acc, d) => acc + Number(d.mrr_value || 0), 0);
                        return (
                          <div key={stage} style={{ background: '#F7F4EF', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid #E6E0D8' }}>
                            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#2C221E60', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stage}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 600, display: 'block', margin: '4px 0 2px 0' }}>£{stageMrr}</span>
                            <span style={{ fontSize: '10px', color: '#C88A65' }}>{stageDeals.length} deals</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card-box" style={{ padding: 0, overflowX: 'auto' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #E6E0D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>Active Pipeline & Customer Deals ({deals.length})</h3>
                      <button onClick={() => setIsDealModalOpen(true)} style={{ background: '#2C221E', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                        Add New Deal
                      </button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', minWidth: '550px' }}>
                      <thead>
                        <tr style={{ background: '#F2ECE4', color: '#2C221E70', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '1rem 1.5rem' }}>Company / Salon</th>
                          <th style={{ padding: '1rem 1.5rem' }}>Deal Name</th>
                          <th style={{ padding: '1rem 1.5rem' }}>Stage</th>
                          <th style={{ padding: '1rem 1.5rem' }}>MRR Value</th>
                          <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Company Profile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deals.map((d) => {
                          const comp = companies.find(c => c.id === d.company_id);
                          return (
                            <tr key={d.id} style={{ borderTop: '1px solid #E6E0D8' }}>
                              <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>{comp?.business_name || 'Unknown Company'}</td>
                              <td style={{ padding: '1.25rem 1.5rem', color: '#2C221E70' }}>{d.deal_name}</td>
                              <td style={{ padding: '1.25rem 1.5rem' }}>
                                <span style={{ background: '#C88A6515', color: '#C88A65', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                  {d.stage}
                                </span>
                              </td>
                              <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#047857' }}>£{d.mrr_value}/mo</td>
                              <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                {comp && (
                                  <button onClick={() => setSelectedCompany(comp)} style={{ background: '#2C221E', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>
                                    View Company
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACTS */}
              {currentTab === 'contacts' && (
                <div className="card-box" style={{ padding: 0, overflowX: 'auto' }}>
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #E6E0D8' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>Company CRM Directory ({companies.length} Salons)</h3>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', minWidth: '550px' }}>
                    <thead>
                      <tr style={{ background: '#F2ECE4', color: '#2C221E70', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '1rem 1.5rem' }}>Business Name</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Owner / Contact</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Associated Deals Count</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Email & Phone</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((comp) => {
                        const compDeals = deals.filter(d => d.company_id === comp.id);
                        return (
                          <tr key={comp.id} style={{ borderTop: '1px solid #E6E0D8' }}>
                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>{comp.business_name}</td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>{comp.contact_name}</td>
                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#C88A65' }}>{compDeals.length} Deal{compDeals.length > 1 ? 's' : ''}</td>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#2C221E70', fontSize: '0.75rem' }}>
                              <div>{comp.email}</div>
                              <div>{comp.phone}</div>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                              <button onClick={() => setSelectedCompany(comp)} style={{ background: '#2C221E', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>
                                Open Company Hub
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: PRODUCTS & PRICING CATALOG */}
              {currentTab === 'products' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {products.map((p) => (
                      <div key={p.id} className="card-box" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 500, margin: 0 }}>{p.name}</h4>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => handleStartEditProduct(p)} style={{ background: '#C88A6520', color: '#C88A65', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Edit3 size={12} /> Edit
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer' }}>Delete</button>
                            </div>
                          </div>
                          <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#C88A65', marginBottom: '4px' }}>
                            £{p.mrr}<span style={{ fontSize: '0.75rem', color: '#2C221E70' }}>/mo</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#2C221E60', marginBottom: '1rem' }}>
                            Initial Setup Fee: £{p.setup_fee}
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#2C221E70', margin: '0 0 1rem 0' }}>{p.description}</p>
                          
                          <div style={{ borderTop: '1px solid #E6E0D8', paddingTop: '12px' }}>
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#C88A65', display: 'block', marginBottom: '8px' }}>Included Features ({p.features?.length || 0}):</span>
                            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#2C221E80', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {p.features?.map((feat: string, i: number) => (
                                <li key={i}>{feat}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65', fontWeight: 700, margin: 0 }}>
                        {editingProductId ? 'Edit Product Tier' : 'Add New Product Tier & Assign Features'}
                      </h3>
                      {editingProductId && (
                        <button onClick={() => { setEditingProductId(null); setNewProd({ name: '', mrr: '', setup_fee: '', description: '', features: [] }); }} style={{ background: 'none', border: 'none', color: '#2C221E70', fontSize: '0.75rem', cursor: 'pointer' }}>
                          Cancel Editing
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tier Title *</label>
                          <input type="text" placeholder="e.g. Pro Sanctuary Suite" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} required />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Monthly Price (£) *</label>
                          <input type="number" placeholder="149" value={newProd.mrr} onChange={e => setNewProd({...newProd, mrr: e.target.value})} required />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Setup Fee (£)</label>
                          <input type="number" placeholder="299" value={newProd.setup_fee} onChange={e => setNewProd({...newProd, setup_fee: e.target.value})} />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Package Short Description</label>
                        <input type="text" placeholder="Built for multi-room independent practitioners..." value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} />
                      </div>

                      {/* Feature Ticker Checklist */}
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65', display: 'block', marginBottom: '8px' }}>
                          Select Features to Include in this Tier ({newProd.features.length} selected):
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px', background: '#F7F4EF', padding: '1rem', borderRadius: '1rem', border: '1px solid #E6E0D8' }}>
                          {masterFeatureList.map((feat) => {
                            const isChecked = newProd.features.includes(feat);
                            return (
                              <div 
                                key={feat}
                                onClick={() => toggleFeatureSelection(feat)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 12px',
                                  background: isChecked ? '#2C221E' : '#FFFFFF',
                                  color: isChecked ? '#FFFFFF' : '#2C221E',
                                  borderRadius: '8px',
                                  border: '1px solid #E6E0D8',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <div style={{ width: '14px', height: '14px', borderRadius: '4px', border: '1px solid #C88A65', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isChecked ? '#C88A65' : 'transparent', flexShrink: 0 }}>
                                  {isChecked && <Check size={10} color="#FFFFFF" />}
                                </div>
                                <span>{feat}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', borderRadius: '1rem', padding: '0.85rem 2rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                          {editingProductId ? 'Update Product Tier' : 'Save & Publish Product Tier'}
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: CMS */}
              {currentTab === 'cms' && (
                <div className="card-box" style={{ maxWidth: '800px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 400, margin: '0 0 4px 0' }}>Global Website Content CMS</h3>
                  <p style={{ fontSize: '0.8rem', color: '#2C221E70', marginBottom: '1.5rem' }}>Edit every headline, title, description, and copy element across your public landing page.</p>
                  
                  <form onSubmit={handleSaveCms} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Branding */}
                    <div style={{ background: '#F7F4EF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E6E0D8', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#C88A65', display: 'block', marginBottom: '4px' }}>Logo Text</label>
                        <input type="text" value={siteConfig.logoText} onChange={e => setSiteConfig({...siteConfig, logoText: e.target.value})} />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#C88A65', display: 'block', marginBottom: '4px' }}>Logo Badge Tag</label>
                        <input type="text" value={siteConfig.logoBadge} onChange={e => setSiteConfig({...siteConfig, logoBadge: e.target.value})} />
                      </div>
                    </div>

                    {/* Hero Section */}
                    <div style={{ background: '#F7F4EF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E6E0D8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#C88A65', margin: 0 }}>Hero Section</h4>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Hero Headline</label>
                        <input type="text" value={siteConfig.heroHeadline} onChange={e => setSiteConfig({...siteConfig, heroHeadline: e.target.value})} />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Hero Subtitle</label>
                        <textarea rows={2} value={siteConfig.heroSubtitle} onChange={e => setSiteConfig({...siteConfig, heroSubtitle: e.target.value})} style={{ background: '#FFFFFF' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Hero CTA Button Text</label>
                        <input type="text" value={siteConfig.heroCtaText} onChange={e => setSiteConfig({...siteConfig, heroCtaText: e.target.value})} />
                      </div>
                    </div>

                    {/* Sandbox Simulator Section */}
                    <div style={{ background: '#F7F4EF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E6E0D8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#C88A65', margin: 0 }}>Interactive Sandbox Section</h4>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Sandbox Header</label>
                        <input type="text" value={siteConfig.sandboxHeader} onChange={e => setSiteConfig({...siteConfig, sandboxHeader: e.target.value})} />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Sandbox Subtext</label>
                        <textarea rows={2} value={siteConfig.sandboxSubtext} onChange={e => setSiteConfig({...siteConfig, sandboxSubtext: e.target.value})} style={{ background: '#FFFFFF' }} />
                      </div>
                    </div>

                    {/* Features / Pillars Section */}
                    <div style={{ background: '#F7F4EF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E6E0D8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#C88A65', margin: 0 }}>Features Section</h4>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Section Header</label>
                        <input type="text" value={siteConfig.featuresHeader} onChange={e => setSiteConfig({...siteConfig, featuresHeader: e.target.value})} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Feature 1 Title</label>
                          <input type="text" value={siteConfig.feature1Title} onChange={e => setSiteConfig({...siteConfig, feature1Title: e.target.value})} />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Feature 1 Description</label>
                          <input type="text" value={siteConfig.feature1Desc} onChange={e => setSiteConfig({...siteConfig, feature1Desc: e.target.value})} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Feature 2 Title</label>
                          <input type="text" value={siteConfig.feature2Title} onChange={e => setSiteConfig({...siteConfig, feature2Title: e.target.value})} />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Feature 2 Description</label>
                          <input type="text" value={siteConfig.feature2Desc} onChange={e => setSiteConfig({...siteConfig, feature2Desc: e.target.value})} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Feature 3 Title</label>
                          <input type="text" value={siteConfig.feature3Title} onChange={e => setSiteConfig({...siteConfig, feature3Title: e.target.value})} />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Feature 3 Description</label>
                          <input type="text" value={siteConfig.feature3Desc} onChange={e => setSiteConfig({...siteConfig, feature3Desc: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Footer */}
                    <div style={{ background: '#F7F4EF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E6E0D8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#C88A65', margin: 0 }}>Pricing & Footer</h4>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Pricing Section Header</label>
                        <input type="text" value={siteConfig.pricingHeader} onChange={e => setSiteConfig({...siteConfig, pricingHeader: e.target.value})} />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2C221E70', display: 'block', marginBottom: '4px' }}>Footer Copyright Text</label>
                        <input type="text" value={siteConfig.footerText} onChange={e => setSiteConfig({...siteConfig, footerText: e.target.value})} />
                      </div>
                    </div>

                    <button type="submit" disabled={savingCms} style={{ background: '#2C221E', color: 'white', border: 'none', borderRadius: '1rem', padding: '1rem 2rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
                      {savingCms ? 'Publishing...' : 'Publish All Website Copy Live'}
                    </button>

                  </form>
                </div>
              )}

              {/* TAB 5: FINANCES */}
              {currentTab === 'finances' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="card-box" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C88A65' }}>Reporting Period: {finData.label}</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        { id: 'this-month', label: 'This Month' },
                        { id: 'last-month', label: 'Last Month' },
                        { id: 'q3', label: 'Q3 2026' },
                        { id: 'ytd', label: 'YTD 2026' },
                        { id: 'all', label: 'All-Time' },
                      ].map(f => (
                        <button 
                          key={f.id}
                          onClick={() => setFinanceFilter(f.id as any)}
                          style={{
                            background: financeFilter === f.id ? '#2C221E' : '#F7F4EF',
                            color: financeFilter === f.id ? '#FFFFFF' : '#2C221E',
                            border: '1px solid #E6E0D8',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <div className="card-box" style={{ margin: 0 }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Period MRR</span>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: 300, margin: 0 }}>£{finData.filteredMrr}</h3>
                    </div>
                    <div className="card-box" style={{ margin: 0 }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Cumulative Revenue</span>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: 300, margin: 0 }}>£{finData.cumulativeRevenue}</h3>
                    </div>
                    <div className="card-box" style={{ margin: 0 }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C88A65', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Active Customer Deals</span>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: 300, margin: 0 }}>{finData.activeCount}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CONTRACTS */}
              {currentTab === 'contracts' && (
                <div className="card-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Signed Client Contracts & SLA Vault</h3>
                    <button onClick={() => setIsContractModalOpen(true)} style={{ background: '#2C221E', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Upload size={14} /> Upload Contract
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {Array.from(new Set(documents.map(d => d.company_name))).map(compName => {
                      const compDocs = documents.filter(d => d.company_name === compName);
                      return (
                        <div key={compName} style={{ background: '#F7F4EF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E6E0D8' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#C88A65', margin: '0 0 10px 0' }}>{compName} ({compDocs.length} Document{compDocs.length > 1 ? 's' : ''})</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {compDocs.map(doc => (
                              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E6E0D8', flexWrap: 'wrap', gap: '8px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{doc.title} <span style={{ fontSize: '0.7rem', color: '#2C221E60', marginLeft: '8px' }}>({doc.file_size})</span></span>
                                <button onClick={() => handleDeleteDoc(doc.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* POP-OUT MODAL FOR ADDING DEALS */}
      {isDealModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '650px', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 400, margin: 0 }}>Add New Deal / Renewal</h3>
              <button onClick={() => setIsDealModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C221E70' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDealSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Select Existing Company or Enter New *</label>
                <select 
                  value={dealForm.company_id} 
                  onChange={e => {
                    const found = companies.find(c => c.id === Number(e.target.value));
                    setDealForm({
                      ...dealForm, 
                      company_id: e.target.value,
                      new_business_name: found ? found.business_name : ''
                    });
                  }}
                  style={{ marginBottom: '8px' }}
                >
                  <option value="">-- Choose Existing Salon / Company --</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.business_name} ({c.contact_name})</option>)}
                </select>

                {!dealForm.company_id && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '6px' }}>
                    <input type="text" placeholder="New Business Name *" value={dealForm.new_business_name} onChange={e => setDealForm({...dealForm, new_business_name: e.target.value})} required />
                    <input type="text" placeholder="Contact Person *" value={dealForm.contact_name} onChange={e => setDealForm({...dealForm, contact_name: e.target.value})} required />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Deal Name (e.g. Q4 Renewal, New Branch) *</label>
                <input type="text" placeholder="e.g. Main Street Branch Subscription" value={dealForm.deal_name} onChange={e => setDealForm({...dealForm, deal_name: e.target.value})} required />
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Pipeline Stage</label>
                <select value={dealForm.stage} onChange={e => setDealForm({...dealForm, stage: e.target.value})}>
                  {pipelineStages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Product / Package Tier *</label>
                <select value={dealForm.product_tier} onChange={e => handleProductChange(e.target.value)}>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name} (£{p.mrr}/mo + £{p.setup_fee} setup)</option>)}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 600 }}>Monthly Value (£)</label>
                  <label style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#C88A65' }}>
                    <input type="checkbox" checked={dealForm.override_mrr} onChange={e => setDealForm({...dealForm, override_mrr: e.target.checked})} /> Override
                  </label>
                </div>
                <input type="number" value={dealForm.mrr_value} disabled={!dealForm.override_mrr} onChange={e => setDealForm({...dealForm, mrr_value: Number(e.target.value)})} style={{ background: dealForm.override_mrr ? '#FFFFFF' : '#F7F4EF' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 600 }}>Initial Setup Fee (£)</label>
                  <label style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#C88A65' }}>
                    <input type="checkbox" checked={dealForm.override_setup} onChange={e => setDealForm({...dealForm, override_setup: e.target.checked})} /> Override
                  </label>
                </div>
                <input type="number" value={dealForm.setup_value} disabled={!dealForm.override_setup} onChange={e => setDealForm({...dealForm, setup_value: Number(e.target.value)})} style={{ background: dealForm.override_setup ? '#FFFFFF' : '#F7F4EF' }} />
              </div>

              {(dealForm.override_mrr || dealForm.override_setup) && (
                <div style={{ gridColumn: '1 / -1', background: '#FEF3C7', padding: '12px', borderRadius: '10px', border: '1px solid #F59E0B30' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#92400E', display: 'block', marginBottom: '4px' }}>Reason for Custom Pricing Override *</label>
                  <textarea rows={2} placeholder="e.g. Agreed to a discounted renewal rate." value={dealForm.pricing_reason} onChange={e => setDealForm({...dealForm, pricing_reason: e.target.value})} required style={{ width: '100%', background: '#FFFFFF', border: '1px solid #F59E0B60' }} />
                </div>
              )}

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsDealModalOpen(false)} style={{ background: '#F7F4EF', color: '#2C221E', border: '1px solid #E6E0D8', borderRadius: '1rem', padding: '0.75rem 1.5rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', borderRadius: '1rem', padding: '0.75rem 2rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>Save Deal</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* POP-OUT MODAL FOR UPLOADING CONTRACTS */}
      {isContractModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '500px', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 400, margin: 0 }}>Upload Client Contract</h3>
              <button onClick={() => setIsContractModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C221E70' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadContractSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Select Company / Salon *</label>
                <select value={contractForm.company_name} onChange={e => setContractForm({...contractForm, company_name: e.target.value})} required>
                  <option value="">-- Choose Company --</option>
                  {companies.map(c => <option key={c.id} value={c.business_name}>{c.business_name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Document Title *</label>
                <input type="text" placeholder="e.g. Renewal SLA 2026.pdf" value={contractForm.title} onChange={e => setContractForm({...contractForm, title: e.target.value})} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsContractModalOpen(false)} style={{ background: '#F7F4EF', color: '#2C221E', border: '1px solid #E6E0D8', borderRadius: '1rem', padding: '0.75rem 1.5rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#2C221E', color: 'white', border: 'none', borderRadius: '1rem', padding: '0.75rem 2rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>Upload Document</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}