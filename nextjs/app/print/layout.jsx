// Print pages: black ink on white, no chrome, tuned for Letter paper.
export const metadata = { title: { default: "Print · AI Lab week 5", template: "%s · Print · AI Lab week 5" } };

export default function PrintLayout({ children }) {
  return <div className="print-root">{children}</div>;
}
