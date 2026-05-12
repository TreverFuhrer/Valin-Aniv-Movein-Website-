import "./globals.css";

export const metadata = {
  title: "Pooker",
  description: "Valentines + Anniversary + Moving in together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
