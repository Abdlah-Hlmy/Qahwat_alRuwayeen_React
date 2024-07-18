import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-700 mb-0 text-white text-center p-4">
      <div className="tracking-widest text-sm border-b pb-4 border-slate-500">
        {' '}
        مكان يلتقي فيه القارئ والكاتب
      </div>
      <div className="text-sm flex items-center justify-center gap-x-2 gap-y-1 pt-4 max-md:flex-col">
        <p>كل حقوق الطبع والنشر محفوظة &copy; {new Date().getFullYear()} </p>
        <span className="flex gap-1">
          تصميم وتطوير :{' '}
          <a
            href="https://www.facebook.com/profile.php?id=100071322474651"
            target="_blank"
            className="transition-all hover:text-slate-300 cursor-pointer"
          >
            Abdlah Hlmy
          </a>
        </span>
      </div>
    </footer>
  );
}
