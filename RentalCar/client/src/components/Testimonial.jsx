import React from "react";
import Title from "./Title";

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
    <div
      className="
      p-6 mx-4 w-72 shrink-0 rounded-xl
      backdrop-blur-md
      bg-dark-soft/80
      border border-border
      hover:border-primary
      hover:shadow-[0_0_25px_rgba(198,169,107,0.35)]
      transition
      "
    >
      <div className="flex gap-3 items-center">
        <img src={card.image} className="w-11 h-11 rounded-full object-cover" />

        <div>
          <p className="text-text-main text-sm">{card.name}</p>

          <span className="text-xs text-text-muted">{card.handle}</span>
        </div>
      </div>

      <p className="text-sm mt-4 text-text-muted leading-relaxed">
        Renting a luxury car has never been this smooth. The entire process felt
        premium from start to finish.
      </p>

      <div className="flex justify-between mt-5 text-xs text-text-muted">
        <span>Posted on X</span>

        <span>{card.date}</span>
      </div>
    </div>
  );

  return (
    <section className="py-28 px-6">
      <div className="text-center">
        <Title
          title="Loved by Travelers Worldwide"
          subTitle="Real stories from guests who chose us for their luxury journeys."
        />
      </div>

      {/* ROW 1 */}

      <div className="relative overflow-hidden max-w-6xl mx-auto mt-16">
        {/* LEFT FADE */}

        <div
          className="
          absolute left-0 top-0 w-32 h-full
          bg-gradient-to-r from-dark to-transparent
          z-10
          "
        />

        <div className="marquee">
          {[...cardsData, ...cardsData].map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>

        {/* RIGHT FADE */}

        <div
          className="
          absolute right-0 top-0 w-32 h-full
          bg-gradient-to-l from-dark to-transparent
          z-10
          "
        />
      </div>

      {/* ROW 2 */}

      <div className="relative overflow-hidden max-w-6xl mx-auto mt-10">
        <div
          className="
          absolute left-0 top-0 w-32 h-full
          bg-gradient-to-r from-dark to-transparent
          z-10
          "
        />

        <div className="marquee reverse">
          {[...cardsData, ...cardsData].map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>

        <div
          className="
          absolute right-0 top-0 w-32 h-full
          bg-gradient-to-l from-dark to-transparent
          z-10
          "
        />
      </div>
    </section>
  );
};

export default Testimonial;
