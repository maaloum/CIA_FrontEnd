interface Window {
  google: {
    accounts: {
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (response: GoogleOAuthResponse) => void;
        }) => {
          requestAccessToken: () => void;
        };
      };
    };
  };
}

interface GoogleOAuthResponse {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}
