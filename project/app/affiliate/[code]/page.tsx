'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AffiliateCodeAliasPage() {
  const router = useRouter();
  const params = useParams<{ code: string }>();

  useEffect(() => {
    const code = params?.code;
    if (!code) {
      router.replace('/');
      return;
    }
    router.replace(`/ref/${code}`);
  }, [params, router]);

  return null;
}

