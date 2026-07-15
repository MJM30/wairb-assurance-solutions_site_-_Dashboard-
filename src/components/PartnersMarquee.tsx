"use client";

const partners = [
  { src: "/images/prt_01.jpg", alt: "Partenaire 1" },
  { src: "/images/prt_02.jpg", alt: "Partenaire 2" },
  { src: "/images/prt_03.jpg", alt: "Partenaire 3" },
  { src: "/images/prt_04.jpg", alt: "Partenaire 4" },
  { src: "/images/prt_05.jpg", alt: "Partenaire 5" },
  { src: "/images/prt_06.jpg", alt: "Partenaire 6" },
];

const PartnersMarquee = () => {
  // Duplicate for seamless loop
  const items = [...partners, ...partners, ...partners];

  return (
    <section className="py-14 bg-white border-t border-b border-primary/5 overflow-hidden">
      <div className="container mb-8">
        <p className="text-center text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Ceux qui nous font confiance
        </p>
      </div>
      <div className="relative flex overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="flex animate-marquee gap-12 items-center">
          {items.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 h-24 w-44 rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-3 hover:shadow-md transition-all duration-300"
            >
              <img
                src={p.src}
                alt={p.alt}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
