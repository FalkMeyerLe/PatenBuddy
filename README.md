**Welcome to your Base44 project**

**About**

View and Edit  your app on [Base44.com](http://Base44.com)

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

Any change pushed to the repo will also be reflected in the Base44 Builder.

**Prerequisites:**

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

**Google SSO Setup**

The app uses Firebase Authentication with Google Sign-In.
Only the configured Google account is allowed to sign in and access write functionality.

1. In the [Firebase Console](https://console.firebase.google.com/), open the **patenbuddy** project.
2. Go to **Authentication → Sign-in method** and enable **Google**.
3. Add your domain (e.g. `localhost`) to the list of **Authorised domains**.
4. Copy `.env.example` to `.env.local` and set the allowed email address:

```
VITE_ALLOWED_GOOGLE_EMAIL=your-google-account@gmail.com
```

If `VITE_ALLOWED_GOOGLE_EMAIL` is not set it defaults to `falkmeyerle@gmail.com`.
Any other Google account that attempts to sign in will be immediately signed out.

Run the app: `npm run dev`

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)
