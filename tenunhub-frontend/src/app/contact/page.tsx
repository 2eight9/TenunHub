import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] pt-16 pb-24 px-6 font-sans flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto mb-10 mt-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#7F1D1D] mb-4 tracking-tight">
          Di Balik TenunHub
        </h1>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
          Merawat benang merah tradisi tanah Timor melalui sentuhan inovasi
          teknologi masa depan.
        </p>
      </div>
      <div className="max-w-4xl w-full flex flex-col gap-6">
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-[#333333] mb-4">
            Tentang TenunHub
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
            <p>
              TenunHub adalah platform digital yang dirancang khusus untuk
              mendigitalkan, melestarikan, dan mempromosikan mahakarya seni
              tenun lokal ke panggung yang lebih luas.
            </p>
            <p>
              Melalui platform ini, kami menghubungkan para pengrajin berbakat
              langsung dengan para pecinta budaya. Kami memastikan setiap helai
              benang, motif, dan filosofi di baliknya dihargai dengan layak
              tanpa harus melewati rantai distribusi yang panjang.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-[#333333] mb-4">
            Visi Sang Founder
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
            <p>
              Halo, saya{" "}
              <span className="text-[#D97706] font-bold">Apriliano Boimau</span>
              .
            </p>
            <p>
              Platform ini lahir dari sebuah kegelisahan dan harapan.
              Kegelisahan melihat kain tenun tradisional yang kaya akan makna
              mulai tergerus laju zaman, dan harapan untuk mengangkat karya
              tangan para pengrajin lokal ke panggung digital secara
              profesional.
            </p>
            <p>
              Saya merancang sistem ini dengan mengintegrasikan AI (Kecerdasan
              Buatan) untuk membantu meracik dan menceritakan filosofi puitis di
              balik setiap karya. Kami memastikan bahwa nilai budaya dan cerita
              sang penenun tetap menyala abadi di era modern.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8  pb-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Mari Berkolaborasi
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Punya ide, pertanyaan, atau ingin bergabung?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href="https://apriliano.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all text-sm shadow-sm text-center whitespace-nowrap"
              >
                Lihat Web Portfolio
              </a>

              <a
                href="mailto:inoboimau@gmail.com"
                className="bg-[#7F1D1D] hover:bg-[#541313] text-white font-bold py-3 px-6 rounded-xl transition-all text-sm shadow-md text-center whitespace-nowrap"
              >
                Kirim Email ➞
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <a
              href="https://www.linkedin.com/in/2eight9"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-110 hover:opacity-75"
              title="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="#334155"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="https://github.com/2eight9"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-110 hover:opacity-75"
              title="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="#334155"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/2eight9_d1"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-110 hover:opacity-75"
              title="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="#334155"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/">
            <button className="text-slate-500 hover:text-[#7F1D1D] font-bold text-sm transition-all inline-flex items-center gap-2">
              ← Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
