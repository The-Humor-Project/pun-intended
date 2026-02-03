import {Suspense} from "react";

import LoginPageClient from "./LoginPageClient";

function LoginPageFallback() {
  return (
    <main className="page login-page" aria-busy="true">
      <div className="page__content">
        <section className="card auth-card" aria-labelledby="login-title">
          <h2 id="login-title" className="sr-only">
            Account
          </h2>
          <div className="auth-card__panel">
            <span className="auth-card__note">Loading account...</span>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
