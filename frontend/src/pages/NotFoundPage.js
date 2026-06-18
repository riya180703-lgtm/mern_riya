import { useEffect } from "react";

function NotFoundPage() {
  useEffect(() => {
    document.title = "Spice Garden | Page Not Found";
  }, []);

  return (
    <main className="section">
      <h1>404 - Page Not Found</h1>
      <p>Please check the URL and try again.</p>
    </main>
  );
}

export default NotFoundPage;
