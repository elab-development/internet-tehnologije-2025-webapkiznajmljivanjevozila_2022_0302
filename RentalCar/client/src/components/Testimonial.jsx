import React from "react";

const goldBg = "linear-gradient(135deg, #c6a96b, #b89655, #d4b873)";

const Testimonial = () => {
  const cardsData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@neilstellar",
      date: "April 20, 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averywrites",
      date: "May 10, 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200",
      name: "Jordan Lee",
      handle: "@jordantalks",
      date: "June 5, 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200",
      name: "Chris Parker",
      handle: "@chrisdrives",
      date: "May 10, 2025",
    },
  ];

  const Card = ({ card }) => (
    <div className="p-6 mx-4 w-72 shrink-0 rounded-xl bg-[#181f18] border border-white/10 hover:border-[#c6a96b] hover:shadow-[0_0_25px_rgba(198,169,107,0.4)] transition">
      <div className="flex gap-3 items-center">
        <img src={card.image} className="w-11 h-11 rounded-full object-cover" />
        <div>
          <p className="text-white text-sm">{card.name}</p>
          <span className="text-white/60 text-xs">{card.handle}</span>
        </div>
      </div>

      <p className="text-sm mt-4 text-white/70 leading-relaxed">
        Renting a luxury car has never been this smooth. The entire process felt
        premium from start to finish.
      </p>

      <div className="flex justify-between mt-5 text-xs text-white/50">
        <span>Posted on X</span>
        <span>{card.date}</span>
      </div>
    </div>
  );

  return (
    <section
      className="pt-10 pb-24 px-6 -mt-[6px] relative z-10 overflow-hidden"
      style={{
        background: goldBg,
        clipPath: "polygon(0 0, 0 100%, 50% 86%, 100% 100%, 100% 0)",
      }}
    >
      {/*TEKSTURA */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 6px)",
        }}
      />
      {/* TITLE */}
      <div className="text-center mb-6 relative z-10">
        <h2 className="text-3xl md:text-3xl font-semibold text-[#181f18]">
          Loved by Travelers Worldwide
        </h2>

        <p className="text-white/90 mt-4 max-w-xl mx-auto">
          Real stories from guests who chose us for their luxury journeys.
        </p>
      </div>

      {/* ROW */}
      <div className="relative overflow-hidden max-w-7xl mx-auto z-10">
        <div
          className="absolute left-0 top-0 w-20 h-full z-10"
          style={{
            background: "linear-gradient(to right, #c6a96b, transparent)",
          }}
        />

        <div className="marquee">
          {[...cardsData, ...cardsData].map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>

        <div
          className="absolute right-0 top-0 w-20 h-full z-10"
          style={{
            background: "linear-gradient(to left, #c6a96b, transparent)",
          }}
        />
      </div>
    </section>
  );
};

export default Testimonial;
