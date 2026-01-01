/**
 * YouTube helper utilities for validating and converting URLs to embed IDs.
 */

// Improved regex that handles URLs with query parameters anywhere in the string
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

  // Try to match YouTube URL - search anywhere in the string for the pattern
  // This handles URLs with query parameters before or after the video ID
  const match = trimmed.match(YOUTUBE_ID_REGEX);
  if (match && match[1]) {
    return match[1];
  }

  // Fallback: try to find video ID pattern in URL-encoded strings
  // Look for 11-character alphanumeric sequences that might be video IDs
  const possibleIdMatch = trimmed.match(/[?&](?:v|video_id)=([\w-]{11})/i);
  if (possibleIdMatch && possibleIdMatch[1]) {
    return possibleIdMatch[1];
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
  if (!input) return null;
  const id = extractYouTubeId(input);
  return id ? buildYouTubeEmbedUrl(id) : null;
}

/**
 * Lightweight validator for UI forms.
 */
export function isValidYouTubeUrl(input: string | undefined | null): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  
  // Check if it's a raw 11-char ID
  if (/^[\w-]{11}$/.test(trimmed)) return true;
  
  // Check if it contains a valid YouTube URL pattern
  if (YOUTUBE_ID_REGEX.test(trimmed)) return true;
  
  // Check if it contains video ID in query parameters
  if (/[?&](?:v|video_id)=([\w-]{11})/i.test(trimmed)) return true;
  
  return false;
}