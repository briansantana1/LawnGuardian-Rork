import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { 
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';

function getRCToken() {
  if (__DEV__ || Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
  }
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
    default: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY,
  });
}

const rcToken = getRCToken();
let isConfigured = false;

if (rcToken && !isConfigured) {
  console.log('Configuring RevenueCat with token:', rcToken?.substring(0, 10) + '...');
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: rcToken });
  isConfigured = true;
  console.log('RevenueCat configured successfully');
}

export const [PurchasesProvider, usePurchases] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured && rcToken) {
      console.log('Late configuring RevenueCat...');
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      Purchases.configure({ apiKey: rcToken });
      isConfigured = true;
      setIsInitialized(true);
    }
  }, []);

  const customerInfoQuery = useQuery({
    queryKey: ['customerInfo'],
    queryFn: async () => {
      console.log('Fetching customer info...');
      try {
        const info = await Purchases.getCustomerInfo();
        console.log('Customer info fetched:', info.activeSubscriptions);
        return info;
      } catch (error) {
        console.error('Error fetching customer info:', error);
        throw error;
      }
    },
    enabled: isInitialized,
    staleTime: 1000 * 60 * 5,
  });

  const offeringsQuery = useQuery({
    queryKey: ['offerings'],
    queryFn: async () => {
      console.log('Fetching offerings...');
      try {
        const offerings = await Purchases.getOfferings();
        console.log('Offerings fetched:', offerings.current?.identifier);
        return offerings;
      } catch (error) {
        console.error('Error fetching offerings:', error);
        throw error;
      }
    },
    enabled: isInitialized,
    staleTime: 1000 * 60 * 10,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (pkg: PurchasesPackage) => {
      console.log('Purchasing package:', pkg.identifier);
      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        console.log('Purchase successful:', customerInfo.activeSubscriptions);
        return customerInfo;
      } catch (error: any) {
        if (error.userCancelled) {
          console.log('User cancelled purchase');
          throw new Error('cancelled');
        }
        console.error('Purchase error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerInfo'] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      console.log('Restoring purchases...');
      try {
        const customerInfo = await Purchases.restorePurchases();
        console.log('Restore successful:', customerInfo.activeSubscriptions);
        return customerInfo;
      } catch (error) {
        console.error('Restore error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerInfo'] });
    },
  });

  const isPro = useCallback(() => {
    const entitlements = customerInfoQuery.data?.entitlements?.active;
    return entitlements ? 'pro' in entitlements : false;
  }, [customerInfoQuery.data]);

  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<{ success: boolean; error?: string }> => {
    try {
      await purchaseMutation.mutateAsync(pkg);
      return { success: true };
    } catch (error: any) {
      if (error.message === 'cancelled') {
        return { success: false, error: 'cancelled' };
      }
      return { success: false, error: error.message || 'Purchase failed' };
    }
  }, [purchaseMutation.mutateAsync]);

  const restore = useCallback(async (): Promise<{ success: boolean; hasActiveSubscription: boolean; error?: string }> => {
    try {
      const customerInfo = await restoreMutation.mutateAsync();
      const hasActive = customerInfo.entitlements?.active ? 'pro' in customerInfo.entitlements.active : false;
      return { success: true, hasActiveSubscription: hasActive };
    } catch (error: any) {
      return { success: false, hasActiveSubscription: false, error: error.message || 'Restore failed' };
    }
  }, [restoreMutation.mutateAsync]);

  const refreshCustomerInfo = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['customerInfo'] });
  }, [queryClient]);

  return {
    isInitialized,
    customerInfo: customerInfoQuery.data,
    offerings: offeringsQuery.data,
    isLoadingCustomerInfo: customerInfoQuery.isLoading,
    isLoadingOfferings: offeringsQuery.isLoading,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
    isPro: isPro(),
    purchase,
    restore,
    refreshCustomerInfo,
    weeklyPackage: offeringsQuery.data?.current?.availablePackages.find(p => p.identifier === '$rc_weekly'),
    annualPackage: offeringsQuery.data?.current?.availablePackages.find(p => p.identifier === '$rc_annual'),
  };
});
