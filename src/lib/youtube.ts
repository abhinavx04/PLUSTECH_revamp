/**
 * YouTube helper utilities for validating and converting URLs to embed IDs.
 */

const YOUTUBE_ID_REGEX =
  /(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/i;

/**
 * Extract the YouTube video ID from a URL or raw ID.
 */
export function extractYouTubeId(input: string | undefined | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Already looks like an 11-char ID
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  // Try to match YouTube URL (works even with query parameters)
  const match = trimmed.match(YOUTUBE_ID_REGEX);
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

/**
 * Build a privacy-friendly embed URL for an ID.
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

/**
 * Convert a user-supplied URL into a normalized embed URL if valid.
 */
export function normalizeYouTubeEmbedUrl(input: string | undefined | null): string | null {
  const id = extractYouTubeId(input || '');
  return id ? buildYouTubeEmbedUrl(id) : null;
}

/**
 * Lightweight validator for UI forms.
 */
export function isValidYouTubeUrl(input: string | undefined | null): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  // Check if it's a raw 11-char ID or contains a valid YouTube URL pattern
  return /^[\w-]{11}$/.test(trimmed) || YOUTUBE_ID_REGEX.test(trimmed);
}

