import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 grow flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm text-center w-full">
        <div className="text-4xl mb-3">🐾</div>
        <h1 className="text-xl font-bold text-gray-950 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-xs mt-2 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition font-bold text-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
