import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="admin-page">
      <div className="admin-content">
        <header className="hero admin-hero">
          <p className="eyebrow">Admin Console</p>
          <h1>Admin Home</h1>
          <p className="lead">
            Choose a section to manage assignments, agendas, semesters, or users.
          </p>
        </header>

        <section className="card admin-section">
          <div className="admin-section__header">
            <div>
              <h2>Assignments</h2>
              <p className="admin-section__meta">
                Edit assignment details, due dates, and semester mappings.
              </p>
            </div>
          </div>
          <div className="admin-panel__actions">
            <Link className="admin-button admin-button--primary" href="/admin/assignments">
              Manage assignments
            </Link>
          </div>
        </section>

        <section className="card admin-section">
          <div className="admin-section__header">
            <div>
              <h2>Meeting agendas</h2>
              <p className="admin-section__meta">
                Create agendas, set meeting times, and update discussion notes.
              </p>
            </div>
          </div>
          <div className="admin-panel__actions">
            <Link className="admin-button admin-button--primary" href="/admin/agendas">
              Manage agendas
            </Link>
          </div>
        </section>

        <section className="card admin-section">
          <div className="admin-section__header">
            <div>
              <h2>Semesters</h2>
              <p className="admin-section__meta">
                Update semester names and create new terms.
              </p>
            </div>
          </div>
          <div className="admin-panel__actions">
            <Link className="admin-button admin-button--primary" href="/admin/semesters">
              Manage semesters
            </Link>
          </div>
        </section>

        <section className="card admin-section">
          <div className="admin-section__header">
            <div>
              <h2>Users</h2>
              <p className="admin-section__meta">
                Search profiles and manage superadmin access.
              </p>
            </div>
          </div>
          <div className="admin-panel__actions">
            <Link className="admin-button admin-button--primary" href="/admin/users">
              Manage users
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
