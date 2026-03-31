'use client';

import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTrackAffiliateCode } from '@/hooks/useAffiliate';
import { saveAffiliateTracking } from '@/utils/affiliateTracking';

export default function AffiliateRefPage() {
  const router = useRouter();
  const params = useParams<{ code: string }>();
  const searchParams = useSearchParams();
  const trackAffiliateCode = useTrackAffiliateCode();

  useEffect(() => {
    const code = params?.code;
    if (!code) {
      router.replace('/');
      return;
    }

    const fallback = searchParams.get('redirect') || '/';

    trackAffiliateCode.mutate(code, {
      onSuccess: (data) => {
        if (data?.tracked && data?.code) {
          saveAffiliateTracking(data.code, data.cookieWindowDays);
        }
      },
      onError: () => {
        // Do not block user navigation if tracking fails.
      },
      onSettled: () => {
        router.replace(fallback);
      },
    });
  }, [params, router, searchParams, trackAffiliateCode]);

  return (
    <div className="min-h-screen bg-gray-1 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-gray-7">A aplicar codigo de afiliado...</p>
      </div>
    </div>
  );
}

