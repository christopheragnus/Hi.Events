import {
    AcceptInvitationRequest,
    GenericDataResponse,
    LoginData,
    LoginResponse, RegisterAccountRequest,
    ResetPasswordRequest,
    User
} from "../types.ts";
import {api} from './client.ts';
import {setAuthToken} from "../utilites/apiClient.ts";

// Define the backend login response format
interface BackendLoginResponse {
        user: User;
        accounts?: any[];
}

export const authClient = {
    refreshAccessTokenFn: async () => {
        const response = await api.post<LoginResponse>('/auth/refresh');
        
        // If we got a new token, update it in the headers
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        
        return response.data;
    },

    register: async (registerData: RegisterAccountRequest) => {
        const response = await api.post<GenericDataResponse<User>>('/users/tokens/sign_up', registerData);
        return response.data;
    },

    login: async (user: LoginData) => {
        const response = await api.post<BackendLoginResponse>('/login', { account: user });
        console.log(response.data);
        // Extract token from Authorization header
        const authHeader = response.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : null;
        
        // Ensure we have user data or create a default empty user object
        const userData = response.data.user || {
            first_name: '',
            last_name: '',
            full_name: '',
            email: ''
        };
        
        // If token exists in header, set it in the auth headers for future requests
        if (token) {
            setAuthToken(token);
        }
        
        // Transform response to match expected format
        const transformedResponse: LoginResponse = {
            token: token, // Use token from header instead of response body
            token_type: "Bearer",
            expires_in: 3600, // Default expiry time, adjust as needed
            user: userData,
            accounts: response.data.accounts || []
        };
        

        console.log(transformedResponse);
        return transformedResponse;
    },

    logout: async () => {
        const response = await api.post('auth/logout');
        // Clear auth token on logout
        setAuthToken(null);
        return response.data;
    },

    forgotPassword: async (email: { email: string }) => {
        const response = await api.post('auth/forgot-password', email);
        return response.data;
    },

    verifyPasswordResetToken: async (token: string) => {
        const response = await api.get(`auth/reset-password/${token}`);
        return response.data;
    },

    resetPassword: async (token: string, resetData: ResetPasswordRequest) => {
        const response = await api.post(`auth/reset-password/${token}`, resetData);
        return response.data;
    },

    getInvitation: async (token: string) => {
        const response = await api.get<GenericDataResponse<User>>(`auth/invitation/${token}`);
        return response.data;
    },

    acceptInvitation: async (token: string, acceptData: AcceptInvitationRequest) => {
        const response = await api.post(`auth/invitation/${token}`, acceptData);
        return response.data;
    }
}