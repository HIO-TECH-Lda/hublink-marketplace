const AFFILIATE_CODE_KEY = 'affiliateCode';
const AFFILIATE_TRACKED_AT_KEY = 'affiliateTrackedAt';
const DEFAULT_TTL_DAYS = 30;

const canUseStorage = (): boolean => typeof window !== 'undefined';

export const saveAffiliateTracking = (code: string, cookieWindowDays?: number) => {
  if (!canUseStorage() || !code) return;

  const ttlDays = cookieWindowDays && cookieWindowDays > 0 ? cookieWindowDays : DEFAULT_TTL_DAYS;
  const trackedAt = Date.now();

  localStorage.setItem(AFFILIATE_CODE_KEY, code);
  localStorage.setItem(AFFILIATE_TRACKED_AT_KEY, String(trackedAt));
  localStorage.setItem(`${AFFILIATE_TRACKED_AT_KEY}:ttlDays`, String(ttlDays));
};

export const getAffiliateCode = (): string | null => {
  if (!canUseStorage()) return null;

  const code = localStorage.getItem(AFFILIATE_CODE_KEY);
  const trackedAt = Number(localStorage.getItem(AFFILIATE_TRACKED_AT_KEY) || '0');
  const ttlDays = Number(localStorage.getItem(`${AFFILIATE_TRACKED_AT_KEY}:ttlDays`) || DEFAULT_TTL_DAYS);

  if (!code || !trackedAt) return null;

  const expiresAt = trackedAt + ttlDays * 24 * 60 * 60 * 1000;
  if (Date.now() > expiresAt) {
    clearAffiliateTracking();
    return null;
  }

  return code;
};

export const clearAffiliateTracking = () => {
  if (!canUseStorage()) return;
  localStorage.removeItem(AFFILIATE_CODE_KEY);
  localStorage.removeItem(AFFILIATE_TRACKED_AT_KEY);
  localStorage.removeItem(`${AFFILIATE_TRACKED_AT_KEY}:ttlDays`);
};

