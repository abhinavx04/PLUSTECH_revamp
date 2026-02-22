import { useCallback, useEffect, useRef } from 'react';

const DRAFT_PREFIX = 'admin_draft_';

/**
 * Auto-saves form data to localStorage as the user types (debounced).
 * Restores the saved draft when the form opens after a reload.
 *
 * - `key`: unique identifier for this form (e.g. "projects", "news")
 * - `editingId`: the ID of the item being edited, or null for new items
 * - `formData`: current form state (must be JSON-serializable)
 * - `setFormData`: state setter to restore the draft into
 * - `isOpen`: whether the form panel is currently open
 * - `extraState`: optional additional state to save (e.g. publishDate for news)
 */
interface UseFormDraftOptions<T, E = undefined> {
  key: string;
  editingId: string | null;
  formData: T;
  setFormData: (data: T) => void;
  isOpen: boolean;
  extraState?: E;
  setExtraState?: (data: E) => void;
}

function buildStorageKey(key: string, editingId: string | null): string {
  return `${DRAFT_PREFIX}${key}_${editingId || 'new'}`;
}

export function useFormDraft<T, E = undefined>(options: UseFormDraftOptions<T, E>) {
  const { key, editingId, formData, setFormData, isOpen, extraState, setExtraState } = options;
  const storageKey = buildStorageKey(key, editingId);
  const hasRestored = useRef(false);
  const prevStorageKey = useRef(storageKey);

  // Reset restoration flag when the storage key changes (different item or new vs edit)
  useEffect(() => {
    if (prevStorageKey.current !== storageKey) {
      hasRestored.current = false;
      prevStorageKey.current = storageKey;
    }
  }, [storageKey]);

  // Restore draft when form opens
  useEffect(() => {
    if (!isOpen || hasRestored.current) return;
    hasRestored.current = true;

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;

      const saved = JSON.parse(raw);
      if (saved && saved.formData) {
        setFormData(saved.formData);
        if (saved.extraState !== undefined && setExtraState) {
          setExtraState(saved.extraState);
        }
      }
    } catch {
      // corrupted data — ignore
    }
  }, [isOpen, storageKey, setFormData, setExtraState]);

  // Auto-save to localStorage (debounced 500ms)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      try {
        const payload: Record<string, unknown> = { formData };
        if (extraState !== undefined) {
          payload.extraState = extraState;
        }
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {
        // storage full or private browsing — ignore silently
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen, formData, extraState, storageKey]);

  // Warn before unload if form is open with content
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isOpen]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return { clearDraft };
}
