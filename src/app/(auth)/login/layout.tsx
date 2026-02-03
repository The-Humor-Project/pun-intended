import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Login | The Humor Project",
  description: "Sign in to access course materials.",
};

export default function LoginLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  return <>{children}</>;
}
