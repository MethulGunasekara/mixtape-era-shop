'use client'

export default function Marquee() {
  const items = [
    '/// LAPTOP STICKERS ///',
    'WATERPROOF ///',
    'VIBE PROOF ///',
    'RETRO AESTHETIC ///',
    'LIMITED EDITION ///',
  ]

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items]

  return (
    <div className="overflow-hidden border-y-2 border-brand-black bg-brand-yellow py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="font-display text-lg font-bold mx-8 text-brand-black inline-block"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

