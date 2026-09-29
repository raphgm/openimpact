export function getRepoAvatar(_seed = 'user'): string {
  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
}

export function getRepoLogo(_seed = 'project'): string {
  return 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=150&auto=format&fit=crop&q=80';
}

export function getRepoProjectImage(_seed = 'project'): string {
  return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
}

export function sanitizeImageUrl(url?: string): string {
  if (!url || url.includes('skillschlogo.svg')) {
    return 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=150&auto=format&fit=crop&q=80';
  }
  return url;
}
