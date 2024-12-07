// src/app/layout.tsx
import "../globals.css"; // Ensure global styles are included


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
