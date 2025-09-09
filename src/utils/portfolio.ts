/**
 * Utility functions for portfolio URL generation and management
 */

/**
 * Generate a unique portfolio URL slug from photographer's name
 * @param firstName - Photographer's first name
 * @param lastName - Photographer's last name
 * @param existingUrls - Array of existing URLs to check for uniqueness
 * @returns Unique portfolio URL slug
 */
export function generatePortfolioSlug(
  firstName: string, 
  lastName: string, 
  existingUrls: string[] = []
): string {
  // Create base slug from name
  const baseSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
    .replace(/[^a-z0-9-]/g, '') // Remove special characters
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes

  // Check if slug is unique
  let slug = baseSlug;
  let counter = 1;
  
  while (existingUrls.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Generate full portfolio URL
 * @param slug - Portfolio slug
 * @param baseUrl - Base URL (defaults to production URL)
 * @returns Full portfolio URL
 */
export function generatePortfolioUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://snapevent.com';
  return `${base}/photographer/${slug}`;
}

/**
 * Validate portfolio URL format
 * @param url - URL to validate
 * @returns True if valid format
 */
export function isValidPortfolioUrl(url: string): boolean {
  const portfolioUrlRegex = /^https?:\/\/[a-zA-Z0-9.-]+\/photographer\/[a-z0-9-]+$/;
  return portfolioUrlRegex.test(url);
}

/**
 * Extract slug from portfolio URL
 * @param url - Full portfolio URL
 * @returns Slug or null if invalid
 */
export function extractSlugFromUrl(url: string): string | null {
  const match = url.match(/\/photographer\/([a-z0-9-]+)$/);
  return match ? match[1] : null;
}

/**
 * Generate portfolio URL for new photographer
 * @param firstName - Photographer's first name
 * @param lastName - Photographer's last name
 * @param existingUrls - Array of existing URLs
 * @param baseUrl - Base URL for the portfolio
 * @returns Complete portfolio URL
 */
export function createPortfolioUrl(
  firstName: string,
  lastName: string,
  existingUrls: string[] = [],
  baseUrl?: string
): string {
  const slug = generatePortfolioSlug(firstName, lastName, existingUrls);
  return generatePortfolioUrl(slug, baseUrl);
}

/**
 * Format portfolio URL for display
 * @param url - Full portfolio URL
 * @returns Formatted URL for display
 */
export function formatPortfolioUrl(url: string): string {
  return url.replace(/^https?:\/\//, ''); // Remove protocol for display
}
