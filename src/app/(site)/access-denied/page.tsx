import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Access denied",
  description: "Admin access requires a superadmin account.",
};

export default function AccessDeniedPage() {
  return (
    <main className="page">
      <div className="page__content">
        <section className="card auth-card" aria-labelledby="access-denied-title">
          <h2
            id="access-denied-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Access denied
          </h2>
          <p className="lead">
            This area is reserved for course administrators.
          </p>

          <div className="auth-card__panel" aria-live="polite">
            <span className="auth-card__label">Next steps</span>
            <span className="auth-card__note">
              If you believe you should have access, ask a superadmin to enable
              it for your account.
            </span>
            <Link className="auth-card__button" href="/">
              Back to course home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
