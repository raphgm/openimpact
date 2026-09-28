/**
 * Utility to detect and filter out spam or scam GitHub repositories, issues, and bounties
 * (e.g. zhangjiayang6835-cyber/bounty-plaza spam campaigns).
 */

const SPAM_PATTERNS = [
  'zhangjiayang6835-cyber',
  'bounty-plaza',
  'spam-bounty',
  'scam-',
];

export function isSpamUrl(url?: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return SPAM_PATTERNS.some(pattern => lowerUrl.includes(pattern));
}

export function isSpamContent(text?: string): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return SPAM_PATTERNS.some(pattern => lowerText.includes(pattern));
}

export function filterSpamProjects<T extends { githubRepo?: string; title?: string; description?: string }>(items: T[]): T[] {
  return items.filter(item => {
    if (isSpamUrl(item.githubRepo)) return false;
    if (isSpamContent(item.title)) return false;
    if (isSpamContent(item.description)) return false;
    return true;
  });
}

export function filterSpamOpportunities<T extends { githubIssue?: string; title?: string; description?: string }>(items: T[]): T[] {
  return items.filter(item => {
    if (isSpamUrl(item.githubIssue)) return false;
    if (isSpamContent(item.title)) return false;
    if (isSpamContent(item.description)) return false;
    return true;
  });
}
