import React, { useState } from 'react';
import {
  Calendar,
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Coins,
  Ticket,
  Award,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
  Lock,
  FileCheck2,
  Globe,
  Tag,
  PlusCircle,
  Users,
  MapPin
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';

interface SponsorEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency?: Currency;
  onSponsorSuccess?: (eventTitle: string, tierName: string, amount: number, currency: Currency) => void;
}

export const SponsorEventModal: React.FC<SponsorEventModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency: initialCurrency = 'NGN',
  onSponsorSuccess,
}) => {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [activeTab, setActiveTab] = useState<'sponsor' | 'create'>('sponsor');

  // Sample Upcoming Events
  const [events, setEvents] = useState([
    {
      id: 'event-osca-2026',
      title: 'Global Open Source Festival 2026',
      date: 'Oct 15 - 17, 2026',
      location: 'Geneva, Switzerland & Virtual',
      attendees: '2,500+ Developers & Maintainers',
      organizer: 'Global Open Source Guild',
      defaultAmountNGN: 25000000,
      defaultAmountUSD: 25000,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'event-nairobi-hackathon',
      title: 'Helsinki Climate Tech Hackathon',
      date: 'Nov 05 - 07, 2026',
      location: 'Helsinki, Finland',
      attendees: '800+ Builders & Researchers',
      organizer: 'Silicon Lake Collective',
      defaultAmountNGN: 10000000,
      defaultAmountUSD: 10000,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'event-accra-devcon',
      title: 'Accra Web3 & Fintech Summit',
      date: 'Dec 01 - 03, 2026',
      location: 'Accra, Ghana',
      attendees: '1,200+ Founders & Investors',
      organizer: 'Ghana Tech Lab',
      defaultAmountNGN: 15000000,
      defaultAmountUSD: 15000,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0].id);
  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Sponsorship Tiers
  const tierOptions = [
    {
      id: 'platinum',
      name: 'Platinum Sponsor',
      tagline: 'Main Stage Keynote & Exclusive Hackathon Naming',
      amountNGN: 25000000,
      amountUSD: 25000,
      amountKES: 3250000,
      amountGHS: 375000,
      amountEUR: 23000,
      perks: [
        'Main Stage Keynote & VIP Speaker Pass',
        'Top-Tier Branding on All Livestreams & Tickets',
        '$10,000 Dedicated Hackathon Prize Escrow Pool',
        'Direct Access to 2,500+ Verified Developer Resumes',
      ],
    },
    {
      id: 'gold',
      name: 'Gold Sponsor',
      tagline: 'Workshop Hosting & VIP Exhibition Booth',
      amountNGN: 10000000,
      amountUSD: 10000,
      amountKES: 1300000,
      amountGHS: 150000,
      amountEUR: 9200,
      perks: [
        '90-Minute Technical Workshop Track',
        'Exhibition Booth & Banner Placement',
        '501(c)(6) Tax-Deductible Receipt Issued',
        'Swag Bag Branding & Press Release Inclusion',
      ],
    },
    {
      id: 'silver',
      name: 'Silver Sponsor',
      tagline: 'Community Stipends & Digital Branding',
      amountNGN: 2500000,
      amountUSD: 2500,
      amountKES: 325000,
      amountGHS: 37500,
      amountEUR: 2300,
      perks: [
        'Logo placement on Website & Event Schedule',
        '2 VIP Conference Passes',
        'Fund 10 Developer Travel Grants',
      ],
    },
    {
      id: 'custom',
      name: 'Custom Amount',
      tagline: 'Specify your contribution to the event escrow pool',
      amountNGN: 5000000,
      amountUSD: 5000,
      amountKES: 650000,
      amountGHS: 75000,
      amountEUR: 4600,
      perks: ['Custom sponsor perks based on contribution size'],
    },
  ];

  const [selectedTierId, setSelectedTierId] = useState<string>('gold');
  const selectedTier = tierOptions.find((t) => t.id === selectedTierId) || tierOptions[1];

  const [customAmount, setCustomAmount] = useState<number>(5000000);
  const [sponsorName, setSponsorName] = useState<string>('');
  const [sponsorEmail, setSponsorEmail] = useState<string>('');
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile' | 'crypto'>('bank');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [createdEventSubmitted, setCreatedEventSubmitted] = useState<boolean>(false);
  const [txReceiptHash, setTxReceiptHash] = useState<string>('');

  // Form state for creating a new event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventOrganizer, setNewEventOrganizer] = useState('');
  const [newEventDates, setNewEventDates] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('Geneva, Switzerland');
  const [newEventAttendees, setNewEventAttendees] = useState('500+ Builders');
  const [newEventRepo, setNewEventRepo] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventMilestones, setNewEventMilestones] = useState(
    '1. Venue & AV Equipment Deposit\n2. Hackathon Escrow Prize Pool\n3. Speaker Stipends & Travel Grants'
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Amount computation
  const getAmountForCurrency = (tier: typeof selectedTier) => {
    if (selectedTierId === 'custom') return customAmount;
    if (currency === 'NGN') return tier.amountNGN;
    if (currency === 'USD') return tier.amountUSD;
    if (currency === 'KES') return tier.amountKES;
    if (currency === 'GHS') return tier.amountGHS;
    if (currency === 'EUR') return tier.amountEUR;
    return tier.amountUSD;
  };

  const finalAmount = getAmountForCurrency(selectedTier);
  const currencySymbol = getCurrencySymbol(currency);

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const hash = `0xOPENIMPACT_EVENT_${Math.floor(Math.random() * 899999 + 100000)}_${Date.now()}`;
    setTxReceiptHash(hash);

    setTimeout(() => {
      setIsProcessing(false);
      setSubmitted(true);
      if (onSponsorSuccess) {
        onSponsorSuccess(selectedEvent.title, selectedTier.name, finalAmount, currency);
      }
    }, 1200);
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventOrganizer) return;

    setIsProcessing(true);
    const hash = `0xEVENT_HOST_${Math.floor(Math.random() * 899999 + 100000)}_${Date.now()}`;
    setTxReceiptHash(hash);

    setTimeout(() => {
      const created = {
        id: `event_${Date.now()}`,
        title: newEventTitle,
        date: newEventDates || 'Upcoming 2026',
        location: newEventLocation,
        attendees: newEventAttendees,
        organizer: newEventOrganizer,
        defaultAmountNGN: 15000000,
        defaultAmountUSD: 15000,
        image: '/unicef_innovation.svg',
      };
      setEvents([created, ...events]);
      setSelectedEventId(created.id);
      setIsProcessing(false);
      setCreatedEventSubmitted(true);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200/90 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl text-slate-900 relative max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto mx-auto text-left font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30 shrink-0">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  {activeTab === 'sponsor' ? 'Sponsor an Event' : 'Create & Host Event'}
                </h3>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono border border-emerald-200">
                  501(c)(6) Tax-Deductible
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {activeTab === 'sponsor'
                  ? 'Fund high-impact tech summits, hackathons, and open source conferences with milestone escrow.'
                  : 'Register a community event or summit under OpenImpact 501(c)(6) fiscal sponsorship and unlock corporate grants.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition cursor-pointer shrink-0 shadow-xs border border-slate-200"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        {!submitted && !createdEventSubmitted && (
          <div className="flex items-center space-x-2 pt-4 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('sponsor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'sponsor'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>Sponsor Upcoming Event</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'create'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              <span>Create / Propose New Event</span>
            </button>
          </div>
        )}

        {/* 1. CREATED EVENT SUCCESS STATE */}
        {createdEventSubmitted ? (
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-2xl font-extrabold text-slate-950">Event Registered with Fiscal Escrow!</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-900">{newEventTitle}</span> by{' '}
                <span className="font-bold text-indigo-600">{newEventOrganizer}</span> is now active under OpenImpact's 501(c)(6) non-profit fiscal sponsorship. Sponsors can now deposit funds directly into your milestone escrow vault.
              </p>
            </div>

            {/* Cryptographic Escrow Receipt Card */}
            <div className="bg-slate-950 text-white rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 font-mono text-xs shadow-xl border border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>501(c)(6) Event Escrow Account</span>
                </span>
                <span className="text-emerald-400 font-extrabold">LIVE</span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Event Title:</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{newEventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Organizer:</span>
                  <span className="text-indigo-300">{newEventOrganizer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-200">{newEventLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escrow ID:</span>
                  <span className="text-slate-400 truncate w-36">{txReceiptHash}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setCreatedEventSubmitted(false);
                  setActiveTab('sponsor');
                }}
                className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer"
              >
                View in Event Directory
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : submitted ? (
          /* 2. SPONSOR CONFIRMATION SUCCESS STATE */
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-2xl font-extrabold text-slate-950">Event Sponsorship Locked!</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thank you for sponsoring <span className="font-bold text-slate-900">{selectedEvent.title}</span> as a{' '}
                <span className="font-bold text-indigo-600">{selectedTier.name}</span>. Funds are securely deposited into milestone escrow.
              </p>
            </div>

            {/* Cryptographic Escrow Receipt Card */}
            <div className="bg-slate-950 text-white rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 font-mono text-xs shadow-xl border border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>501(c)(6) Tax Receipt</span>
                </span>
                <span className="text-emerald-400 font-extrabold">VERIFIED</span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Event:</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{selectedEvent.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier:</span>
                  <span className="text-indigo-300">{selectedTier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sponsor Amount:</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(finalAmount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escrow Contract:</span>
                  <span className="text-slate-400 truncate w-36">{txReceiptHash}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Tax Exemption ID: 501-C6-OPENIMPACT</span>
                <span className="text-indigo-400 font-bold">100% Deductible</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : activeTab === 'create' ? (
          /* 3. CREATE / HOST EVENT FORM */
          <form onSubmit={handleCreateEventSubmit} className="space-y-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Africa Open Hardware Summit 2026"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Host Organization / Collective *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geneva Tech Collective & OSCA"
                  value={newEventOrganizer}
                  onChange={(e) => setNewEventOrganizer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Event Dates</label>
                <input
                  type="text"
                  placeholder="e.g. Nov 14 - 16, 2026"
                  value={newEventDates}
                  onChange={(e) => setNewEventDates(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Geneva, Switzerland & Virtual"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Expected Attendees</label>
                <input
                  type="text"
                  placeholder="e.g. 1,500+ Developers"
                  value={newEventAttendees}
                  onChange={(e) => setNewEventAttendees(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Event Purpose & Impact Summary</label>
              <textarea
                rows={2}
                placeholder="Briefly describe the conference tracks, keynotes, hackathons, and who this event empowers..."
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Event Transparency Repository Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-indigo-600" />
                    <span>Event Documentation & Transparency Repository (GitHub / GitLab)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Why create a repository for an event?
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-mono">
                  Recommended for Escrow
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 text-[11px] text-slate-600">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-1.5 shadow-2xs">
                  <FileCheck2 className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Audit Trail</strong>: Store vendor quotes, venue contracts, and itemized invoice receipts.</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-1.5 shadow-2xs">
                  <Award className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Hackathon PRs</strong>: Judge builder code submissions and release prize bounties openly.</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-1.5 shadow-2xs">
                  <Globe className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Open Playbook</strong>: Share schedules, slide decks, and logistics so others can replicate.</span>
                </div>
              </div>

              <input
                type="url"
                placeholder="https://github.com/organization/summit-2026-transparency"
                value={newEventRepo}
                onChange={(e) => setNewEventRepo(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Escrow Milestone Deliverables (For Fund Release)</label>
              <textarea
                rows={2}
                placeholder="1. Venue Deposit & Contract\n2. Hackathon Prize Pool\n3. Speaker Travel Stipends"
                value={newEventMilestones}
                onChange={(e) => setNewEventMilestones(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="font-semibold">501(c)(6) Non-Profit Fiscal Escrow Host: <strong>OpenImpact Global</strong></span>
              </div>
              <span className="font-mono text-[11px] bg-indigo-200/70 px-2 py-0.5 rounded-full font-bold">5% Platform Fee</span>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition shadow-md shadow-indigo-600/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Registering Event Escrow...</span>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    <span>Publish Event to Directory</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* 4. SPONSOR EVENT FORM */
          <form onSubmit={handleSponsorSubmit} className="space-y-6 pt-4">
            
            {/* Event Selector & Currency bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-mono">
                  1. Select Event to Sponsor
                </label>
                
                {/* Currency Switcher */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <Globe className="h-3.5 w-3.5 text-slate-500 ml-1" />
                  {(['NGN', 'USD', 'KES', 'GHS', 'EUR'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition cursor-pointer font-mono ${
                        currency === c ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`rounded-2xl p-3 border-2 transition cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      selectedEventId === ev.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="h-20 w-full rounded-xl overflow-hidden relative">
                      <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3 text-amber-300" />
                        <span>{ev.date}</span>
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <h5 className="font-bold text-xs text-slate-950 leading-snug line-clamp-2">{ev.title}</h5>
                      <p className="text-[10px] text-slate-500 font-medium">{ev.location}</p>
                    </div>

                    <div className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md font-mono self-start">
                      {ev.attendees}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsorship Tier Selection */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-mono">
                2. Select Sponsorship Level
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {tierOptions.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  const tierAmt = tier.id === 'custom' ? customAmount : getAmountForCurrency(tier);

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`rounded-2xl p-3.5 border-2 transition cursor-pointer text-left flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-950 text-white shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-900'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black ${isSelected ? 'text-indigo-200' : 'text-slate-900'}`}>
                            {tier.name}
                          </span>
                          {tier.id === 'platinum' && (
                            <span className="bg-amber-400 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className={`text-base font-black font-mono ${isSelected ? 'text-emerald-400' : 'text-indigo-700'}`}>
                          {formatCurrency(tierAmt, currency)}
                        </div>
                        <p className={`text-[10px] leading-tight font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {tier.tagline}
                        </p>
                      </div>

                      {tier.id === 'custom' && isSelected && (
                        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(Number(e.target.value))}
                            className="w-full bg-slate-800 text-white text-xs font-mono font-bold p-1.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-400"
                            placeholder="Amount"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tier Perks Details */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-2 text-left">
                <span className="text-[11px] font-extrabold text-indigo-900 font-mono flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Sponsor Benefits Included ({selectedTier.name}):</span>
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                  {selectedTier.perks.map((perk, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                  <li className="flex items-center space-x-1.5 font-semibold text-indigo-800">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span>Instant 501(c)(6) Tax-Deductible Receipt</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sponsor Info & Payment Details */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-mono">
                3. Sponsor & Payment Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp / Foundation"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Billing Email (For Tax Receipt)</label>
                  <input
                    type="email"
                    required
                    placeholder="sponsor@company.org"
                    value={sponsorEmail}
                    onChange={(e) => setSponsorEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Website URL (For Branding)</label>
                  <input
                    type="url"
                    placeholder="https://company.org"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Payment Option Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                {[
                  { id: 'bank', name: 'Bank Wire / SWIFT', icon: Landmark },
                  { id: 'card', name: 'Corporate Card', icon: CreditCard },
                  { id: 'crypto', name: 'USDT / Crypto Escrow', icon: Wallet },
                  { id: 'mobile', name: 'Mobile Money', icon: Smartphone },
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                        paymentMethod === pm.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{pm.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Submit Action */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block font-mono">Total Sponsor Deposit:</span>
                <span className="text-xl font-black text-slate-950 font-mono">
                  {formatCurrency(finalAmount, currency)}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition shadow-md shadow-indigo-600/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Escrow Lock...</span>
                  ) : (
                    <>
                      <span>Lock Event Sponsorship</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
