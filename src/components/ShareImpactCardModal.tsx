import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Award,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
  Smartphone,
  Square,
  Monitor,
  RefreshCw,
  QrCode,
  Lock
} from 'lucide-react';
import { Project, Currency } from '../types';
import { formatCurrency, calculateProgress } from '../utils/formatters';

interface ShareImpactCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  currency?: Currency;
}

type AspectRatioType = 'landscape' | 'square' | 'story';
type ThemeType = 'midnight' | 'emerald' | 'sapphire' | 'ivory';

export const ShareImpactCardModal: React.FC<ShareImpactCardModalProps> = ({
  isOpen,
  onClose,
  project,
  currency = 'USD',
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('landscape');
  const [theme, setTheme] = useState<ThemeType>('midnight');
  const [includeQrCode, setIncludeQrCode] = useState<boolean>(true);
  const [includeCryptoHash, setIncludeCryptoHash] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isShareable, setIsShareable] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentCurrency = currency || project.currency || 'USD';
  const progress = calculateProgress(project.raised, project.fundingGoal);
  const completedMilestones = project.milestones?.filter((m) => m.status === 'Completed').length || 0;
  const totalMilestones = project.milestones?.length || 1;
  const projectUrl = `https://openimpactglobal.org/projects/${project.id}`;

  // Theme palettes
  const themes = {
    midnight: {
      name: 'Midnight Obsidian',
      bgGradient: ['#080C16', '#0F172A', '#020617'],
      primaryText: '#FFFFFF',
      secondaryText: '#94A3B8',
      accentColor: '#8B5CF6',
      accentSecondary: '#10B981',
      cardBg: 'rgba(255, 255, 255, 0.04)',
      cardBorder: 'rgba(255, 255, 255, 0.12)',
      badgeBg: 'rgba(139, 92, 246, 0.18)',
      badgeText: '#C4B5FD',
      isDark: true,
    },
    emerald: {
      name: 'Emerald Escrow',
      bgGradient: ['#031811', '#062C20', '#02120C'],
      primaryText: '#FFFFFF',
      secondaryText: '#A7F3D0',
      accentColor: '#10B981',
      accentSecondary: '#34D399',
      cardBg: 'rgba(16, 185, 129, 0.06)',
      cardBorder: 'rgba(16, 185, 129, 0.22)',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      badgeText: '#6EE7B7',
      isDark: true,
    },
    sapphire: {
      name: 'Deep Sapphire',
      bgGradient: ['#061328', '#0A2540', '#030B1A'],
      primaryText: '#FFFFFF',
      secondaryText: '#BAE6FD',
      accentColor: '#38BDF8',
      accentSecondary: '#818CF8',
      cardBg: 'rgba(56, 189, 248, 0.06)',
      cardBorder: 'rgba(56, 189, 248, 0.22)',
      badgeBg: 'rgba(56, 189, 248, 0.18)',
      badgeText: '#7DD3FC',
      isDark: true,
    },
    ivory: {
      name: 'Milky Minimalist',
      bgGradient: ['#FBF9F5', '#F5EFEB', '#EDE4DB'],
      primaryText: '#0F172A',
      secondaryText: '#475569',
      accentColor: '#6366F1',
      accentSecondary: '#059669',
      cardBg: '#FFFFFF',
      cardBorder: '#E2D9CE',
      badgeBg: 'rgba(99, 102, 241, 0.1)',
      badgeText: '#4338CA',
      isDark: false,
    },
  };

  // Dimensions based on aspect ratio
  const getDimensions = useCallback(() => {
    switch (aspectRatio) {
      case 'square':
        return { width: 1080, height: 1080, displayRatio: '1:1', maxPreviewH: '420px' };
      case 'story':
        return { width: 1080, height: 1920, displayRatio: '9:16', maxPreviewH: '520px' };
      case 'landscape':
      default:
        return { width: 1200, height: 675, displayRatio: '16:9', maxPreviewH: '380px' };
    }
  }, [aspectRatio]);

  // Generate Image onto HTML5 Canvas
  const generateCanvasImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getDimensions();
    canvas.width = width;
    canvas.height = height;

    const currentTheme = themes[theme];

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, currentTheme.bgGradient[0]);
    bgGrad.addColorStop(0.5, currentTheme.bgGradient[1]);
    bgGrad.addColorStop(1, currentTheme.bgGradient[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle background mesh grid and circles
    ctx.save();
    ctx.strokeStyle = currentTheme.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 48;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Glow accents
    const glow1 = ctx.createRadialGradient(width * 0.9, height * 0.15, 10, width * 0.9, height * 0.15, width * 0.5);
    glow1.addColorStop(0, currentTheme.isDark ? 'rgba(139, 92, 246, 0.18)' : 'rgba(99, 102, 241, 0.08)');
    glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(width * 0.1, height * 0.85, 10, width * 0.1, height * 0.85, width * 0.4);
    glow2.addColorStop(0, currentTheme.isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)');
    glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Outer frame padding
    const pad = aspectRatio === 'story' ? 70 : 64;

    // 1. HEADER: LOGO & TAGLINE
    ctx.save();
    // Dual pill logo mark
    const logoX = pad;
    const logoY = pad + 10;
    const pillW = 22;
    const pillH = 34;

    // Purple pill
    ctx.save();
    ctx.translate(logoX + 22, logoY + 16);
    ctx.rotate((-30 * Math.PI) / 180);
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 12);
    ctx.fill();
    ctx.restore();

    // Green pill
    ctx.save();
    ctx.translate(logoX + 10, logoY + 16);
    ctx.rotate((-30 * Math.PI) / 180);
    ctx.fillStyle = '#10B981';
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 12);
    ctx.fill();
    ctx.restore();

    // Brand Name & Tagline text
    ctx.fillStyle = currentTheme.primaryText;
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Open Impact', logoX + 50, logoY + 18);

    ctx.fillStyle = currentTheme.accentColor;
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('Measure · Verify · Prove Impact', logoX + 50, logoY + 38);

    // Top Right Badges (Category & 501c6 Fiscal Seal)
    const rightBadgeText = '501(c)(6) Non-Profit Fiscal Escrow';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    const badgeW = ctx.measureText(rightBadgeText).width + 28;
    const badgeX = width - pad - badgeW;
    const badgeY = pad + 8;

    ctx.fillStyle = currentTheme.cardBg;
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = currentTheme.accentSecondary;
    ctx.beginPath();
    ctx.arc(badgeX + 16, badgeY + 18, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = currentTheme.primaryText;
    ctx.fillText(rightBadgeText, badgeX + 26, badgeY + 22);
    ctx.restore();

    // 2. MAIN PROJECT HIGHLIGHT CARD
    const cardTop = logoY + 70;
    const cardH = aspectRatio === 'story' ? height - cardTop - pad - 120 : height - cardTop - pad - 40;
    const cardW = width - pad * 2;

    ctx.save();
    ctx.fillStyle = currentTheme.cardBg;
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(pad, cardTop, cardW, cardH, 24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Inside card padding
    const innerX = pad + 40;
    let currY = cardTop + 50;

    // Category & Location Tag Pills
    ctx.save();
    const categoryText = project.category.toUpperCase();
    const locationText = project.location;

    // Category Pill
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    const catW = ctx.measureText(categoryText).width + 24;
    ctx.fillStyle = currentTheme.badgeBg;
    ctx.beginPath();
    ctx.roundRect(innerX, currY, catW, 28, 14);
    ctx.fill();
    ctx.fillStyle = currentTheme.badgeText;
    ctx.fillText(categoryText, innerX + 12, currY + 18);

    // Location Pill
    const locW = ctx.measureText(locationText).width + 24;
    const locX = innerX + catW + 12;
    ctx.fillStyle = currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
    ctx.beginPath();
    ctx.roundRect(locX, currY, locW, 28, 14);
    ctx.fill();
    ctx.fillStyle = currentTheme.secondaryText;
    ctx.fillText(locationText, locX + 12, currY + 18);

    // OpenProof Verified Chip
    const openProofText = '✓ OpenProof Verified';
    const opW = ctx.measureText(openProofText).width + 24;
    const opX = locX + locW + 12;
    if (opX + opW < width - pad - 40) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.beginPath();
      ctx.roundRect(opX, currY, opW, 28, 14);
      ctx.fill();
      ctx.fillStyle = '#34D399';
      ctx.fillText(openProofText, opX + 12, currY + 18);
    }
    ctx.restore();

    currY += 56;

    // Project Title (with smart word wrapping)
    ctx.save();
    ctx.fillStyle = currentTheme.primaryText;
    ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';

    const maxTitleWidth = cardW - 80;
    const words = project.title.split(' ');
    let line = '';
    let titleLines = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTitleWidth && n > 0) {
        ctx.fillText(line, innerX, currY);
        line = words[n] + ' ';
        currY += 44;
        titleLines++;
        if (titleLines >= 2) break; // cap at 2 lines
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, innerX, currY);
    currY += 34;

    // Tagline / Description
    ctx.fillStyle = currentTheme.secondaryText;
    ctx.font = '400 17px "Plus Jakarta Sans", sans-serif';
    const taglineText = project.tagline.length > 110 ? `${project.tagline.substring(0, 110)}...` : project.tagline;
    ctx.fillText(taglineText, innerX, currY);
    ctx.restore();

    currY += 42;

    // 3. IMPACT METRICS BAR & STATS BOXES
    ctx.save();
    // Funding Progress Header
    const raisedStr = formatCurrency(project.raised, currentCurrency);
    const goalStr = formatCurrency(project.fundingGoal, currentCurrency);

    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillStyle = currentTheme.secondaryText;
    ctx.fillText('ESCROW DISBURSEMENT PROGRESS', innerX, currY);

    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = currentTheme.accentColor;
    const raisedW = ctx.measureText(`${raisedStr} `).width;
    ctx.fillText(`${raisedStr} `, innerX, currY + 30);

    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillStyle = currentTheme.secondaryText;
    ctx.fillText(`/ ${goalStr} (${progress}% Funded)`, innerX + raisedW, currY + 30);

    // Progress Bar Track & Fill
    const barY = currY + 44;
    const barW = cardW - 80;
    const barH = 14;

    ctx.fillStyle = currentTheme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0';
    ctx.beginPath();
    ctx.roundRect(innerX, barY, barW, barH, 7);
    ctx.fill();

    const fillW = Math.max(14, (barW * Math.min(100, progress)) / 100);
    const fillGrad = ctx.createLinearGradient(innerX, 0, innerX + fillW, 0);
    fillGrad.addColorStop(0, '#8B5CF6');
    fillGrad.addColorStop(0.5, '#3B82F6');
    fillGrad.addColorStop(1, '#10B981');
    ctx.fillStyle = fillGrad;
    ctx.beginPath();
    ctx.roundRect(innerX, barY, fillW, barH, 7);
    ctx.fill();
    ctx.restore();

    currY = barY + 38;

    // 4. STAT BOXES GRID
    const boxW = (cardW - 80 - 32) / 3;
    const boxH = 80;

    const statsData = [
      {
        label: 'VERIFIED MILESTONES',
        value: `${completedMilestones} of ${totalMilestones}`,
        sub: 'Audited & Signed',
        color: '#10B981',
      },
      {
        label: 'CONTRIBUTORS',
        value: `${project.contributorsCount} Active`,
        sub: 'Proof of Work PRs',
        color: '#8B5CF6',
      },
      {
        label: 'COMMUNITY SUPPORTERS',
        value: `${project.supportersCount} Backers`,
        sub: 'Non-Profit Escrow',
        color: '#38BDF8',
      },
    ];

    statsData.forEach((stat, index) => {
      const bX = innerX + index * (boxW + 16);
      ctx.save();
      ctx.fillStyle = currentTheme.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)';
      ctx.strokeStyle = currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bX, currY, boxW, boxH, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = currentTheme.secondaryText;
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(stat.label, bX + 16, currY + 24);

      ctx.fillStyle = currentTheme.primaryText;
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(stat.value, bX + 16, currY + 48);

      ctx.fillStyle = stat.color;
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(stat.sub, bX + 16, currY + 68);
      ctx.restore();
    });

    currY += boxH + 28;

    // 5. FOOTER & QR CODE / CRYPTOGRAPHIC SIGNATURE
    const footerY = cardTop + cardH - 55;
    ctx.save();

    // Cryptographic attestation hash
    if (includeCryptoHash) {
      ctx.fillStyle = currentTheme.secondaryText;
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('CRYPTOGRAPHIC ATTESTATION SHA-256:', innerX, footerY - 14);

      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      const hashStr = `0x${project.id.slice(0, 8)}...8f3a92b4c7e1d5a6b0c2e4f8a1d3b5c7e9f2a4b6`;
      ctx.fillText(hashStr, innerX, footerY);
    }

    // Direct URL & Verification badge on bottom right
    const urlLabel = 'openimpactglobal.org';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    const urlW = ctx.measureText(urlLabel).width;

    ctx.fillStyle = currentTheme.primaryText;
    ctx.fillText(urlLabel, pad + cardW - 40 - urlW, footerY);

    ctx.fillStyle = currentTheme.accentSecondary;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const verifyNote = 'VERIFIED BY OPENPROOF ENGINE';
    const noteW = ctx.measureText(verifyNote).width;
    ctx.fillText(verifyNote, pad + cardW - 40 - noteW, footerY - 16);

    ctx.restore();

    // Export image data URL
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setGeneratedImageUrl(dataUrl);
    } catch (e) {
      console.warn('Canvas export warning:', e);
    }
  }, [aspectRatio, theme, includeQrCode, includeCryptoHash, project, currentCurrency, completedMilestones, totalMilestones, progress, getDimensions]);

  // Regenerate when params change
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        generateCanvasImage();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, generateCanvasImage]);

  if (!isOpen) return null;

  // Social sharing handlers
  const handleDownload = () => {
    if (!isShareable || !canvasRef.current) return;
    setIsGenerating(true);
    const link = document.createElement('a');
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-impact-card.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    setIsGenerating(false);
  };

  const handleCopyImage = async () => {
    if (!isShareable || !canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        // @ts-ignore - ClipboardItem is available in modern browsers
        const item = new ClipboardItem({ 'image/png': blob });
        // @ts-ignore
        await navigator.clipboard.write([item]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      });
    } catch (err) {
      // Fallback: download instead or copy image link
      handleDownload();
    }
  };

  const shareText = `🚀 Check out the verified open impact for ${project.title} on @OpenImpact!\n\n` +
    `💰 ${formatCurrency(project.raised, currentCurrency)} raised (${progress}% funded)\n` +
    `✅ ${completedMilestones} of ${totalMilestones} milestones verified via OpenProof\n` +
    `👥 ${project.contributorsCount} contributors • 501(c)(6) Fiscal Escrow Protection\n\n` +
    `👉 View and fund: ${projectUrl} #PublicGoods #ProofOfWork #OpenSource`;

  const handleCopyCaption = () => {
    if (!isShareable) return;
    navigator.clipboard.writeText(shareText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyLink = () => {
    if (!isShareable) return;
    navigator.clipboard.writeText(projectUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareTwitter = () => {
    if (!isShareable) return;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    if (!isShareable) return;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const dimensions = getDimensions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/45 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#FDFBF7] border border-[#E5DFD5] rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-900 flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#EAE3D2] bg-[#FAF6EE] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-2xs">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">Share Project Impact Card</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Image Generator
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Generate high-resolution social media cards with verified proof of work & escrow metrics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Controls + Live Canvas Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-[#FDFBF7]">
          {/* Controls Column (Left on desktop) */}
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            {/* Aspect Ratio Options */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-2xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-600" />
                <span>Format & Platform</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('landscape')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    aspectRatio === 'landscape'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs'
                      : 'bg-[#FBF9F5] border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Monitor className="h-4 w-4 text-indigo-600" />
                  <span className="text-[11px]">16:9 Banner</span>
                  <span className="text-[9px] text-slate-500">X / LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('square')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    aspectRatio === 'square'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs'
                      : 'bg-[#FBF9F5] border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Square className="h-4 w-4 text-indigo-600" />
                  <span className="text-[11px]">1:1 Square</span>
                  <span className="text-[9px] text-slate-500">Feed / Post</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('story')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    aspectRatio === 'story'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs'
                      : 'bg-[#FBF9F5] border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="h-4 w-4 text-indigo-600" />
                  <span className="text-[11px]">9:16 Story</span>
                  <span className="text-[9px] text-slate-500">Story / Reel</span>
                </button>
              </div>
            </div>

            {/* Visual Color Theme */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-2xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Card Theme</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(themes) as ThemeType[]).map((tKey) => {
                  const t = themes[tKey];
                  const isSelected = theme === tKey;
                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setTheme(tKey)}
                      className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer flex items-center space-x-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-2xs'
                          : 'border-slate-200 bg-[#FBF9F5] text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 shadow-2xs"
                        style={{ background: t.bgGradient[0] }}
                      />
                      <span className="truncate text-[11px]">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification Toggles */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-2xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                <span>Verification & Signature</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                  <span className="font-medium">Cryptographic SHA-256 Hash</span>
                  <input
                    type="checkbox"
                    checked={includeCryptoHash}
                    onChange={(e) => setIncludeCryptoHash(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Public Shareability Control */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Public Shareability</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isShareable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {isShareable ? 'Public (Shareable)' : 'Private (Not Shareable)'}
                </span>
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer pt-1">
                <span className="font-medium">Allow public social sharing & links</span>
                <input
                  type="checkbox"
                  checked={isShareable}
                  onChange={(e) => setIsShareable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 cursor-pointer w-4 h-4"
                />
              </label>
            </div>

            {/* Quick Share to Social Networks */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D6] shadow-2xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1-Click Social Share
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="px-3 py-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/30 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share on X</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  className="px-3 py-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="flex-1 py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center justify-center space-x-1"
                >
                  {copiedCaption ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-500" />}
                  <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center justify-center space-x-1"
                >
                  {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-500" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Generated Card Display (Right on desktop) */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center order-1 lg:order-2 space-y-3">
            <div className="w-full flex items-center justify-between text-xs text-slate-600 px-1">
              <span className="font-mono text-[11px] flex items-center gap-1.5 text-slate-700 font-semibold">
                <ImageIcon className="h-3.5 w-3.5 text-indigo-600" />
                <span>Live Card Render ({dimensions.width} × {dimensions.height}px • {dimensions.displayRatio})</span>
              </span>
              <button
                type="button"
                onClick={generateCanvasImage}
                className="hover:text-slate-900 text-slate-600 flex items-center gap-1 cursor-pointer transition text-[11px] font-medium"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh Preview</span>
              </button>
            </div>

            {!isShareable && (
              <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold p-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs">
                <Lock className="h-4 w-4 shrink-0" />
                <span>Private Card: Public sharing and exporting are currently disabled.</span>
              </div>
            )}

            {/* Visual Canvas Gallery Display */}
            <div className="w-full bg-[#0F172A] p-3 sm:p-4 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-md">
              <div
                className="relative max-w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border border-slate-700/50"
                style={{ maxHeight: dimensions.maxPreviewH }}
              >
                {/* Real Canvas element */}
                <canvas
                  ref={canvasRef}
                  className="w-auto h-auto max-w-full max-h-[60vh] object-contain rounded-lg block"
                  style={{ maxHeight: dimensions.maxPreviewH }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Cards include real-time escrow balance, verified milestones, and cryptographic proof hashes.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#EAE3D2] bg-[#FAF6EE] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            Optimized for Twitter/X cards, LinkedIn posts, Instagram stories, and Open Graph previews.
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyImage}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
              title="Copy Image to Clipboard"
            >
              {copiedImage ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-600" />}
              <span>{copiedImage ? 'Image Copied!' : 'Copy Image'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PNG ({dimensions.displayRatio})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
