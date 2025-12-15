/**
 * YouTube helper utilities for validating and converting URLs to embed IDs.
 */

const YOUTUBE_ID_REGEX =
  /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/i;

/**
 * Extract the YouTube video ID from a URL or raw ID.
 */
export function extractYouTubeId(input: string | undefined | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Already looks like an 11-char ID
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  const match = trimmed.match(YOUTUBE_ID_REGEX);
  return match ? match[1] : null;
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
  return /^[\w-]{11}$/.test(trimmed) || YOUTUBE_ID_REGEX.test(trimmed);
}

