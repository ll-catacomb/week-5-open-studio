import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: { default: "The Notebook · AI Lab week 5", template: "%s · AI Lab week 5" },
  description: "The Notebook — research, notetaking, writing & creating in the age of AI. AI Lab week 5.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#121412",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
