'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CITIES, NICHES, BRAND_CATEGORIES } from '@/lib/constants';
import { Loader, AlertCircle, CheckCircle, User } from 'lucide-react';

type UserRole = 'creator' | 'brand';

interface CreatorFormData {
  displayName: string;
  bio: string;
  instagramHandle: string;
  city: string;
  niches: string[];
  followerCount: string;
  engagementRate: string;
  minRate: string;
  maxRate: string;
  portfolioUrls: string;
}

interface BrandFormData {
  businessName: string;
  category: string;
  city: string;
  description: string;
  instagramHandle: string;
  website: string;
  gstNumber: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [creatorForm, setCreatorForm] = useState<CreatorFormData>({
    displayName: '', bio: '', instagramHandle: '', city: '',
    niches: [], followerCount: '', engagementRate: '',
    minRate: '', maxRate: '', portfolioUrls: '',
  });

  const [brandForm, setBrandForm] = useState<BrandFormData>({
    businessName: '', category: '', city: '', description: '',
    instagramHandle: '', website: '', gstNumber: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/signin'); return; }
    if (status === 'authenticated') fetchProfile();
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setUserRole(data.role);
      if (data.role === 'creator') {
        setCreatorForm({
          displayName: data.profile?.displayName || '',
          bio: data.profile?.bio || '',
          instagramHandle: data.profile?.instagramHandle || '',
          city: data.profile?.city || '',
          niches: data.profile?.niches || [],
          followerCount: data.profile?.followerCount?.toString() || '',
          engagementRate: data.profile?.engagementRate?.toString() || '',
          minRate: data.profile?.rateMin?.toString() || '',
          maxRate: data.profile?.rateMax?.toString() || '',
          portfolioUrls: (data.profile?.portfolioUrls || []).join('\n'),
        });
      } else if (data.role === 'brand') {
        setBrandForm({
          businessName: data.profile?.businessName || '',
          category: data.profile?.category || '',
          city: data.profile?.city || '',
          description: data.profile?.description || '',
          instagramHandle: data.profile?.instagramHandle || '',
          website: data.profile?.website || '',
          gstNumber: data.profile?.gstNumber || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreatorNicheChange = (niche: string) => {
    setCreatorForm(prev => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : [...prev.niches, niche],
    }));
  };

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorForm.displayName.trim()) { showToast('error', 'Display name is required'); return; }
    if (creatorForm.niches.length === 0) { showToast('error', 'Please select at least one niche'); return; }
    try {
      setIsSaving(true);
      const payload = {
        displayName: creatorForm.displayName, bio: creatorForm.bio || null,
        instagramHandle: creatorForm.instagramHandle, city: creatorForm.city,
        niches: creatorForm.niches,
        followerCount: creatorForm.followerCount ? parseInt(creatorForm.followerCount) : null,
        engagementRate: creatorForm.engagementRate ? parseFloat(creatorForm.engagementRate) : null,
        rateMin: parseInt(creatorForm.minRate) || 0,
        rateMax: parseInt(creatorForm.maxRate) || 0,
        portfolioUrls: creatorForm.portfolioUrls.split('\n').map(url => url.trim()).filter(url => url.length > 0),
      };
      const response = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Failed to update profile');
      showToast('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.businessName.trim()) { showToast('error', 'Business name is required'); return; }
    if (!brandForm.category) { showToast('error', 'Category is required'); return; }
    try {
      setIsSaving(true);
      const payload = {
        businessName: brandForm.businessName, category: brandForm.category,
        city: brandForm.city, description: brandForm.description || null,
        instagramHandle: brandForm.instagramHandle || null,
        website: brandForm.website || null, gstNumber: brandForm.gstNumber || null,
      };
      const response = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Failed to update profile');
      showToast('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader size={40} className="mx-auto mb-4 animate-spin text-gray-300" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <div className="badge-premium text-xs font-semibold uppercase tracking-wider inline-flex">
            <User size={12} />
            Profile
          </div>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl text-gray-900">My Profile</h1>
        <p className="text-gray-400 mt-2.5 text-base">Manage your profile information and keep it up to date</p>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className={`mb-6 toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'} flex items-center gap-3`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <p className="font-medium text-sm">{toast.message}</p>
        </div>
      )}

      {/* Creator Profile Form */}
      {userRole === 'creator' && (
        <form onSubmit={handleCreatorSubmit} className="card p-8 sm:p-10">
          <h2 className="text-xl font-extrabold text-gray-900 mb-8">Creator Profile</h2>

          <div className="space-y-6">
            <FormField label="Display Name *">
              <input type="text" value={creatorForm.displayName} onChange={(e) => setCreatorForm({ ...creatorForm, displayName: e.target.value })} className="input-field" placeholder="Your creator name" />
            </FormField>

            <FormField label="Bio">
              <textarea value={creatorForm.bio} onChange={(e) => setCreatorForm({ ...creatorForm, bio: e.target.value })} rows={4} className="input-field resize-none" placeholder="Tell brands about yourself..." />
            </FormField>

            <FormField label="Instagram Handle">
              <div className="flex items-center">
                <span className="text-gray-500 font-medium mr-2">@</span>
                <input type="text" value={creatorForm.instagramHandle} onChange={(e) => setCreatorForm({ ...creatorForm, instagramHandle: e.target.value })} className="input-field flex-1" placeholder="yourhandle" />
              </div>
            </FormField>

            <FormField label="City">
              <select value={creatorForm.city} onChange={(e) => setCreatorForm({ ...creatorForm, city: e.target.value })} className="input-field">
                <option value="">Select a city</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </FormField>

            <FormField label="Niches *">
              <div className="grid grid-cols-2 gap-2.5">
                {NICHES.map(niche => {
                  const isSelected = creatorForm.niches.includes(niche);
                  return (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => handleCreatorNicheChange(niche)}
                      className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border text-left ${
                        isSelected ? 'border-transparent text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                      style={isSelected ? { backgroundColor: 'var(--color-coral)' } : { borderColor: 'var(--color-border)' }}
                    >
                      {niche}
                    </button>
                  );
                })}
              </div>
            </FormField>

            <FormField label="Follower Count">
              <input type="number" value={creatorForm.followerCount} onChange={(e) => setCreatorForm({ ...creatorForm, followerCount: e.target.value })} className="input-field" placeholder="e.g., 15000" min="0" />
            </FormField>

            <FormField label="Engagement Rate (decimal, e.g. 0.035 = 3.5%)">
              <input type="number" value={creatorForm.engagementRate} onChange={(e) => setCreatorForm({ ...creatorForm, engagementRate: e.target.value })} className="input-field" placeholder="e.g., 0.05" step="0.001" min="0" max="1" />
            </FormField>

            <div className="grid grid-cols-2 gap-5">
              <FormField label="Minimum Rate (₹) *">
                <input type="number" value={creatorForm.minRate} onChange={(e) => setCreatorForm({ ...creatorForm, minRate: e.target.value })} className="input-field" placeholder="e.g., 5000" min="0" />
              </FormField>
              <FormField label="Maximum Rate (₹) *">
                <input type="number" value={creatorForm.maxRate} onChange={(e) => setCreatorForm({ ...creatorForm, maxRate: e.target.value })} className="input-field" placeholder="e.g., 25000" min="0" />
              </FormField>
            </div>

            <FormField label="Portfolio URLs (one per line)">
              <textarea value={creatorForm.portfolioUrls} onChange={(e) => setCreatorForm({ ...creatorForm, portfolioUrls: e.target.value })} rows={3} className="input-field resize-none" placeholder={"https://instagram.com/yourhandle\nhttps://youtube.com/channel/..."} />
            </FormField>
          </div>

          <button type="submit" disabled={isSaving} className="btn-primary w-full mt-10 py-4 group text-base">
            {isSaving ? <><Loader size={18} className="animate-spin" /> Saving...</> : 'Save Profile'}
          </button>
        </form>
      )}

      {/* Brand Profile Form */}
      {userRole === 'brand' && (
        <form onSubmit={handleBrandSubmit} className="card p-8 sm:p-10">
          <h2 className="text-xl font-extrabold text-gray-900 mb-8">Brand Profile</h2>

          <div className="space-y-6">
            <FormField label="Business Name *">
              <input type="text" value={brandForm.businessName} onChange={(e) => setBrandForm({ ...brandForm, businessName: e.target.value })} className="input-field" placeholder="Your business name" />
            </FormField>

            <FormField label="Category *">
              <select value={brandForm.category} onChange={(e) => setBrandForm({ ...brandForm, category: e.target.value })} className="input-field">
                <option value="">Select a category</option>
                {BRAND_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </FormField>

            <FormField label="City">
              <select value={brandForm.city} onChange={(e) => setBrandForm({ ...brandForm, city: e.target.value })} className="input-field">
                <option value="">Select a city</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </FormField>

            <FormField label="Description">
              <textarea value={brandForm.description} onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })} rows={4} className="input-field resize-none" placeholder="Tell creators about your brand..." />
            </FormField>

            <FormField label="Instagram Handle">
              <div className="flex items-center">
                <span className="text-gray-500 font-medium mr-2">@</span>
                <input type="text" value={brandForm.instagramHandle} onChange={(e) => setBrandForm({ ...brandForm, instagramHandle: e.target.value })} className="input-field flex-1" placeholder="yourbrand" />
              </div>
            </FormField>

            <FormField label="Website">
              <input type="url" value={brandForm.website} onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })} className="input-field" placeholder="https://www.yourbusiness.com" />
            </FormField>

            <FormField label="GST Number">
              <input type="text" value={brandForm.gstNumber} onChange={(e) => setBrandForm({ ...brandForm, gstNumber: e.target.value })} className="input-field" placeholder="e.g., 18AABCU9603R1Z5" />
            </FormField>
          </div>

          <button type="submit" disabled={isSaving} className="btn-primary w-full mt-10 py-4 group text-base">
            {isSaving ? <><Loader size={18} className="animate-spin" /> Saving...</> : 'Save Profile'}
          </button>
        </form>
      )}

      {/* No Role Message */}
      {!userRole && !isLoading && (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(233, 69, 96, 0.05)' }}>
            <AlertCircle size={36} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">No profile found</h2>
          <p className="text-gray-400">Please complete your onboarding to create your profile</p>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2.5">{label}</label>
      {children}
    </div>
  );
}
