# 🔐 Google OAuth Configuration Guide

To enable Google Login for your Janga application, follow these steps to generate your credentials:

### 1. Create a Google Cloud Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown in the top-left and select **New Project**.
3.  Name it `Janga-Video-Gen` and click **Create**.

### 2. Configure Consent Screen
1.  Navigate to **APIs & Services > OAuth consent screen**.
2.  Choose **External** and fill in the required app information:
    *   **App name**: Janga
    *   **User support email**: Your email
    *   **Developer contact info**: Your email
3.  Add the `.../auth/userinfo.email` and `.../auth/userinfo.profile` scopes.
4.  Add your email as a **Test users** (since the app is in "Testing" mode).

### 3. Create OAuth Credentials
1.  Go to **APIs & Services > Credentials**.
2.  Click **Create Credentials > OAuth client ID**.
3.  Select **Web application** as the application type.
4.  **Authorized JavaScript origins**:
    *   `http://localhost:3000`
5.  **Authorized redirect URIs**:
    *   `http://localhost:3000/api/auth/callback/google`
6.  Click **Create** and copy your **Client ID** and **Client Secret**.

### 4. Update Your Environment
Paste the keys into your `janga/.env` file:

```bash
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
NEXTAUTH_SECRET="run 'openssl rand -base64 32' to generate a secret"
```

### 5. Verify
Restart your Next.js dev server and you should be able to click "Continue with Google" on the login page!
