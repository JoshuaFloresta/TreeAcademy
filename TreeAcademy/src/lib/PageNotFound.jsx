export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B39255]">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#1B432E]">Page not found</h1>
        <p className="mt-2 text-[#1B432E]/70">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}
