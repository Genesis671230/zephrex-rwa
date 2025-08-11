import config from '@/config';

const BASE_URL = config.API_BASE_URL;

const ENDPOINTS = {
  // auth
  getSignData: `${BASE_URL}/user/auth_message`,
  login: `${BASE_URL}/user/sign_in`,
  logout: `${BASE_URL}/user/sign_out`,
};

// OnChainID and Eligibility API functions
export const getOnChainIdDetails = async (walletAddress: string) => {
  try {
    const response = await fetch(`http://localhost:5001/api/v1/kyc/identity/details/${walletAddress}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching OnChainID details:', error);
    throw error;
  }
};

export const checkTokenEligibility = async (walletAddress: string, tokenAddress: string) => {
  try {
    const response = await fetch(`http://localhost:5001/api/v1/kyc/eligibility/${walletAddress}/${tokenAddress}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking token eligibility:', error);
    throw error;
  }
};

export default ENDPOINTS;
