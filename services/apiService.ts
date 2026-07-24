/**
 * 🔐 SECURE API SERVICE
 * Centralized API calls with error handling, timeout, and rate limiting
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Keychain from "react-native-keychain";

const API_BASE_URL = "https://api.visionworldmart.com/backend/api";
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "15000");

class APIRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly MAX_REQUESTS = 10;
  private readonly TIME_WINDOW = 60000; // 1 minute

  isAllowed(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];

    // Remove old requests outside time window
    const recentRequests = requests.filter(
      (time) => now - time < this.TIME_WINDOW,
    );

    if (recentRequests.length >= this.MAX_REQUESTS) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(endpoint, recentRequests);

    return true;
  }
}

const rateLimiter = new APIRateLimiter();

// ✅ API RESPONSE TYPES
export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  company_id?: number;
}

export interface EnquiryData {
  id: number;
  product: string;
  name: string;
  mobile: string;
  company_name: string;
  message: string;
  created_at: string;
  is_read: number;
}

export interface DashboardStats {
  products: number;
  inquiries: number;
  unread: number;
  total: number;
}

// ✅ MAIN API SERVICE CLASS
export class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Make API request with error handling & timeout
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      // 1️⃣ CHECK RATE LIMITING
      if (!rateLimiter.isAllowed(endpoint)) {
        return {
          success: false,
          error: "Too many requests. Please wait.",
        };
      }

      // 2️⃣ CHECK NETWORK
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        return {
          success: false,
          error: "No internet connection",
        };
      }

      // 3️⃣ GET AUTH TOKEN
      const token = await this.getAuthToken();

      // 4️⃣ PREPARE REQUEST
      const url = `${API_BASE_URL}${endpoint}`;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 5️⃣ MAKE REQUEST WITH TIMEOUT
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 6️⃣ VALIDATE RESPONSE
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired - logout
          await this.logout();
          return {
            success: false,
            error: "Session expired. Please login again.",
          };
        }

        if (response.status === 429) {
          return {
            success: false,
            error: "Too many requests from server. Try again later.",
          };
        }

        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      // 7️⃣ PARSE RESPONSE
      const text = await response.text();
      if (!text) {
        return {
          success: false,
          error: "Empty response from server",
        };
      }

      const data = this.safeJsonParse<T>(text);
      if (!data) {
        return {
          success: false,
          error: "Invalid server response",
        };
      }

      return { success: true, data };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "Request timeout. Please try again.",
          };
        }

        if (error instanceof TypeError) {
          return {
            success: false,
            error: "Network error. Please check your connection.",
          };
        }

        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  /**
   * Safe JSON parse
   */
  private safeJsonParse<T>(text: string): T | null {
    try {
      if (!text || typeof text !== "string") {
        return null;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      console.error("JSON Parse Error:", error);
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error("Keychain error:", error);
      return null;
    }
  }

  // ============== PUBLIC API METHODS ==============

  /**
   * Get user profile
   */
  async getUserProfile(email: string): Promise<ApiResponse<UserData>> {
    const result = await this.request<ApiResponse<UserData>>(
      "/user/get-user.php",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
    );

    if (!result.success) {
      return {
        status: false,
        error: result.error,
      };
    }

    return result.data || { status: false };
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats(sellerId: number): Promise<DashboardStats | null> {
    const result = await this.request<DashboardStats>(
      `/seller/dashboard-stats.php?seller_id=${sellerId}`,
      { method: "GET" },
    );

    if (!result.success) {
      console.error("Dashboard stats error:", result.error);
      return null;
    }

    return result.data || null;
  }

  /**
   * Get enquiries for seller
   */
  async getEnquiries(
    companyId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    enquiries: EnquiryData[];
    total: number;
    unread: number;
  } | null> {
    const result = await this.request<any>(
      `/seller/get-enquiries.php?company_id=${companyId}&page=${page}&limit=${limit}`,
      { method: "GET" },
    );

    if (!result.success) {
      console.error("Enquiries error:", result.error);
      return null;
    }

    const data = result.data;
    console.log("Enquiries fetched:", data?.enquiries?.length || 0);
    return {
      enquiries: data?.enquiries || [],
      total: data?.total || 0,
      unread: data?.unread || 0,
    };
  }

  /**
   * Get single enquiry details
   */
  async getEnquiryDetail(enquiryId: number): Promise<EnquiryData | null> {
    const result = await this.request<EnquiryData>(
      `/seller/get-enquiry-detail.php?enquiry_id=${enquiryId}`,
      { method: "GET" },
    );

    if (!result.success) {
      console.error("Enquiry detail error:", result.error);
      return null;
    }

    return result.data || null;
  }

  /**
   * Mark enquiry as read
   */
  async markEnquiryRead(enquiryId: number): Promise<boolean> {
    const result = await this.request<{ status: boolean }>(
      `/seller/mark-read.php`,
      {
        method: "POST",
        body: JSON.stringify({ enquiry_id: enquiryId }),
      },
    );

    return result.success && result.data?.status === true;
  }

  /**
   * Reply to enquiry
   */
  async replyToEnquiry(enquiryId: number, message: string): Promise<boolean> {
    const result = await this.request<{ status: boolean }>(
      `/seller/reply-enquiry.php`,
      {
        method: "POST",
        body: JSON.stringify({
          enquiry_id: enquiryId,
          reply_message: message,
        }),
      },
    );

    return result.success && result.data?.status === true;
  }

  /**
   * Get products for seller
   */
  async getSellerProducts(
    sellerId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ products: any[]; total: number } | null> {
    const result = await this.request<any>(
      `/seller/get-products.php?seller_id=${sellerId}&page=${page}&limit=${limit}`,
      { method: "GET" },
    );

    if (!result.success) {
      console.error("Products error:", result.error);
      return null;
    }

    return {
      products: result.data?.products || [],
      total: result.data?.total || 0,
    };
  }

  /**
   * Add new product
   */
  async addProduct(productData: any): Promise<boolean> {
    const result = await this.request<{ status: boolean }>(
      `/seller/add-product.php`,
      {
        method: "POST",
        body: JSON.stringify(productData),
      },
    );

    return result.success && result.data?.status === true;
  }

  /**
   * Update product
   */
  async updateProduct(productId: number, productData: any): Promise<boolean> {
    const result = await this.request<{ status: boolean }>(
      `/seller/update-product.php`,
      {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          ...productData,
        }),
      },
    );

    return result.success && result.data?.status === true;
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: number): Promise<boolean> {
    const result = await this.request<{ status: boolean }>(
      `/seller/delete-product.php`,
      {
        method: "POST",
        body: JSON.stringify({ product_id: productId }),
      },
    );

    return result.success && result.data?.status === true;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await Keychain.resetGenericPassword();
      await AsyncStorage.removeItem("userInfo");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}

// ✅ EXPORT SINGLETON
export const apiService = ApiService.getInstance();
