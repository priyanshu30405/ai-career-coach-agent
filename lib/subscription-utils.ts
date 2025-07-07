import axios from 'axios';

export interface UsageLimits {
  maxRequests: number;
  currentRequests: number;
  isFreeTier: boolean;
}

export const FREE_TIER_LIMITS = {
  maxRequests: 10, // Limit free tier to 10 requests per tool type
};

export async function checkUsageLimits(aiAgentType: string): Promise<UsageLimits> {
  try {
    // Get user's history to count current usage
    const result = await axios.get('/api/history');
    const historyList = result.data;
    
    // Count requests for this specific tool type
    const currentRequests = historyList.filter((item: any) => 
      item?.aiAgentType === aiAgentType
    ).length;

    return {
      maxRequests: FREE_TIER_LIMITS.maxRequests,
      currentRequests,
      isFreeTier: true, // We'll check subscription status separately
    };
  } catch (error) {
    console.error('Error checking usage limits:', error);
    return {
      maxRequests: FREE_TIER_LIMITS.maxRequests,
      currentRequests: 0,
      isFreeTier: true,
    };
  }
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  try {
    // This will be handled by the component using useAuth hook
    // For now, we'll assume free tier and let the component handle the check
    return false; // Default to free tier
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
} 