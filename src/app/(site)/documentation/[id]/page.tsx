import Link from "next/link";
import {notFound, redirect} from "next/navigation";

import type {Tables} from "@/types/supabase";

import {decodeHtmlEntities} from "@/app/lib/decodeHtmlEntities";
import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";

export const dynamic = "force-dynamic";

type DocumentationRow = Tables<"documentations">;

type DocumentationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatTimestamp = (value: string | null) => {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

const hasRichTextContent = (value: string) => stripHtml(value).length > 0;

export default async function DocumentationPage({
  params,
}: DocumentationPageProps) {
  const { id } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    redirect("/login");
  }

  const documentationId = Number(id);

  if (!Number.isFinite(documentationId)) {
    notFound();
  }

  const { data, error } = await supabase
    .from("documentations")
    .select("*")
    .eq("id", documentationId)
    .limit(1);

  if (error) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card documentation-detail">
            <h2 className="section-title">Documentation</h2>
            <p className="week__empty">{error.message}</p>
            <Link className="assignments-list__meta-label" href="/documentations">
              Back to documentation
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const documentation = (data?.[0] ?? null) as DocumentationRow | null;

  if (!documentation) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card documentation-detail">
            <h2 className="section-title">Documentation</h2>
            <p className="week__empty">Documentation not found.</p>
            <Link className="assignments-list__meta-label" href="/documentations">
              Back to documentation
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const title = documentation.title.trim() || "Untitled documentation";
  const updatedAt =
    documentation.modified_datetime_utc ?? documentation.created_datetime_utc;

  return (
    <main className="page">
      <div className="page__content">
        <section
          className="card documentation-detail"
          aria-labelledby="documentation-title"
        >
          <h2 id="documentation-title" className="section-title">
            {title}
          </h2>
          <div className="assignments-list__meta">
            <span className="assignments-list__meta-label">Last updated</span>
            <span className="assignments-list__meta-value">
              {formatTimestamp(updatedAt)}
            </span>
          </div>
          {hasRichTextContent(documentation.content) ? (
            <div
              className="assignment-body"
              dangerouslySetInnerHTML={{
                __html: decodeHtmlEntities(documentation.content),
              }}
            />
          ) : (
            <p className="week__empty">No documentation details yet.</p>
          )}
          <Link className="assignments-list__meta-label" href="/documentations">
            Back to documentation
          </Link>
        </section>
      </div>
    </main>
  );
}
