import React, { useState, useMemo } from 'react';
import {
  FileText,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  GitPullRequest,
  Receipt,
  Calendar,
  Lock,
  Building2,
  Globe,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Currency, LedgerTransaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface TransparentLedgerExplorerProps {
  collectiveName?: string;
  currency?: Currency;
  initialTransactions?: LedgerTransaction[];
}

export const TransparentLedgerExplorer: React.FC<TransparentLedgerExplorerProps> = ({
  collectiveName = 'FastAPI Open Collective & Escrow',
  currency = 'USD',
  initialTransactions,
}) => {
  const currentCurrency: Currency = (currency as Currency) || 'USD';
  const defaultTransactions: LedgerTransaction[] = [
    {
      id: 'tx_101',
      title: 'Milestone 1 Deliverable Payout: Async WebSocket Payout Router',
      type: 'milestone_payout',
      amount: 15750,
      currency: 'USD',
      date: 'May 20, 2026',
      fromName: 'OpenImpact Escrow Vault',
      toName: 'Tiangolo Dev Collective',
      category: 'Code Deliverables',
      status: 'Completed',
      githubPRUrl: 'https://github.com/tiangolo/fastapi/pull/142',
      proofHash: '0x8f3a92b',
      payoutRail: 'USDC_STABLECOIN',
      taxDocType: 'W-8BEN',
    },
    {
      id: 'tx_102',
      title: 'Monthly Sustaining Gold Sponsor Subscription',
      type: 'contribution',
      amount: 5000,
      currency: 'USD',
      date: 'May 18, 2026',
      fromName: 'Datadog Open Source Fund',
      toName: 'FastAPI Collective',
      category: 'Corporate Sponsorship',
      status: 'Completed',
      taxDocType: '501(c)(6) Tax-Deductible Receipt',
    },
    {
      id: 'tx_103',
      title: 'Cloud Infrastructure & High-Concurrency Benchmark Cluster Hosting',
      type: 'expense_reimbursement',
      amount: 1240,
      currency: 'USD',
      date: 'May 14, 2026',
      fromName: 'FastAPI Collective',
      toName: 'Hetzner & AWS Cloud Services',
      category: 'Infrastructure & Hosting',
      status: 'Completed',
      receiptUrl: 'https://openimpact.io/receipts/inv-2026-894.pdf',
    },
    {
      id: 'tx_104',
      title: 'Security Bug Bounty: Zero-day CVE Path Traversal Patch',
      type: 'milestone_payout',
      amount: 3500,
      currency: 'USD',
      date: 'May 10, 2026',
      fromName: 'OpenImpact Escrow Vault',
      toName: 'Dr. Maya Lin (Security Researcher)',
      category: 'Security Bounty',
      status: 'Completed',
      githubPRUrl: 'https://github.com/tiangolo/fastapi/pull/141',
      proofHash: '0x3c9e12a',
      payoutRail: 'WISE_GLOBAL',
      taxDocType: 'W-9',
    },
    {
      id: 'tx_105',
      title: 'PyCon Africa 2026 Core Maintainer Travel & Workshop Grant',
      type: 'expense_reimbursement',
      amount: 2150,
      currency: 'USD',
      date: 'May 05, 2026',
      fromName: 'FastAPI Collective',
      toName: 'Community Speaker Grantee',
      category: 'Travel & Community',
      status: 'Completed',
      receiptUrl: 'https://openimpact.io/receipts/flight-ticket-accra.pdf',
    },
    {
      id: 'tx_106',
      title: '501(c)(6) Fiscal Sponsorship Oversight & Legal Admin Fee (4%)',
      type: 'fiscal_host_fee',
      amount: 200,
      currency: 'USD',
      date: 'May 01, 2026',
      fromName: 'FastAPI Collective',
      toName: 'OpenImpact Non-Profit Host',
      category: 'Fiscal Hosting Fee',
      status: 'Completed',
      taxDocType: '501(c)(6) Tax-Deductible Receipt',
    },
  ];

  const [transactions, setTransactions] = useState<LedgerTransaction[]>(
    initialTransactions || defaultTransactions
  );
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Compute metrics
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'contribution')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type !== 'contribution')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpenses + 42000; // base escrow reserve

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterType === 'income' && tx.type !== 'contribution') return false;
      if (filterType === 'expense' && tx.type === 'contribution') return false;
      if (categoryFilter !== 'All' && tx.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          tx.title.toLowerCase().includes(q) ||
          tx.fromName.toLowerCase().includes(q) ||
          tx.toName.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, filterType, categoryFilter, searchQuery]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Date,Type,Title,From,To,Amount,Category,Status,ProofHash']
        .concat(
          transactions.map(
            (t) =>
              `"${t.date}","${t.type}","${t.title}","${t.fromName}","${t.toName}","${t.amount}","${t.category}","${t.status}","${t.proofHash || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${collectiveName.replace(/\s+/g, '_')}_ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6 text-left font-sans">
      {/* Header & Balance */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Transparent Financial Ledger & Transactions
            </h2>
            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
              100% Public Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Every contribution, milestone payout, invoice, and contractor expense is permanently indexed.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* THREE METRICS BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Available Collective Balance
          </span>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(netBalance, currentCurrency)}</div>
          <p className="text-[10px] text-slate-400">Held in 501(c)(6) non-profit trust</p>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-emerald-800 uppercase tracking-wider flex items-center gap-1">
            <ArrowDownLeft className="h-3.5 w-3.5" /> Total Contributions Received
          </span>
          <div className="text-2xl font-black text-emerald-900">{formatCurrency(totalIncome, currentCurrency)}</div>
          <p className="text-[10px] text-emerald-700">From recurring backers & grants</p>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-rose-800 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> Total Audited Disbursements
          </span>
          <div className="text-2xl font-black text-rose-900">{formatCurrency(totalExpenses, currentCurrency)}</div>
          <p className="text-[10px] text-rose-700">Backed by GitHub PRs & receipts</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-lg text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filterType === 'all' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filterType === 'income' ? 'bg-emerald-600 text-white' : 'hover:text-slate-900'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filterType === 'expense' ? 'bg-rose-600 text-white' : 'hover:text-slate-900'
              }`}
            >
              Expenses & Payouts
            </button>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by payee, PR, tag..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
            <tr>
              <th className="p-3 font-bold">Transaction / Deliverable</th>
              <th className="p-3 font-bold">Category</th>
              <th className="p-3 font-bold">From &rarr; To</th>
              <th className="p-3 font-bold text-right">Amount</th>
              <th className="p-3 font-bold text-center">Proof / Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filtered.map((tx) => {
              const isIncome = tx.type === 'contribution';
              return (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3">
                    <div className="flex items-start space-x-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : tx.type === 'milestone_payout' ? (
                          <GitPullRequest className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <Receipt className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{tx.title}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {tx.date} • ID: {tx.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                      {tx.category}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-[11px]">
                    <div className="text-slate-600">{tx.fromName}</div>
                    <div className="font-bold text-slate-900">&rarr; {tx.toName}</div>
                  </td>

                  <td className="p-3 text-right">
                    <div
                      className={`font-mono font-black text-sm ${
                        isIncome ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, currentCurrency)}
                    </div>
                    {tx.payoutRail && (
                      <div className="text-[9px] font-mono text-indigo-600 font-bold">
                        via {tx.payoutRail === 'USDC_STABLECOIN' ? 'USDC Vault' : 'Wise Wire'}
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {tx.githubPRUrl ? (
                      <a
                        href={tx.githubPRUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded font-mono text-[10px] font-bold border border-indigo-200 transition"
                      >
                        <ShieldCheck className="h-3 w-3 text-indigo-600" />
                        <span>PR #{tx.proofHash || 'Proof'}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : tx.receiptUrl ? (
                      <a
                        href={tx.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono text-[10px] font-bold border border-slate-200 transition"
                      >
                        <Receipt className="h-3 w-3" />
                        <span>Receipt</span>
                      </a>
                    ) : tx.taxDocType ? (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {tx.taxDocType}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Audited</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
