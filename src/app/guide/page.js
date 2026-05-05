'use client'

import { useState, useRef } from 'react'

const chapters = [
  {
    number: "I",
    label: "What This Is",
    title: "You’re not solving everything.\nYou’re structuring it.",
    opening: "When everything feels mixed together, the problem isn’t just the situation — it’s the lack of structure.",
    body: [
      { type: "prose", text: "Your mind tries to process multiple things at once — outcomes, people, risks, expectations. That creates overload." },
      { type: "prose", text: "When there’s no clear separation, even simple problems feel heavy and unclear." },
      { type: "insight", label: "Core issue", text: "Everything is merged into one undefined problem." },
      { type: "prose", text: "This system doesn’t solve problems directly. It separates them so you can actually see what exists." },
      { type: "pullquote", text: "Clarity comes before action." },
    ],
  },
  {
    number: "II",
    label: "Breakdown Engine",
    title: "Turn one problem\ninto smaller units.",
    opening: "Instead of handling everything together, you break it into parts.",
    body: [
      { type: "prose", text: "Each problem is reduced into smaller pieces based on what’s actually happening." },
      { type: "prose", text: "You define them in simple terms — no explanations, no overthinking." },
      { type: "insight", label: "Goal", text: "Make problems visible and separable." },
      {
        type: "steps",
        items: [
          { label: "Identify", detail: "What exactly is bothering you." },
          { label: "Split", detail: "Break it into smaller parts." },
          { label: "Label", detail: "Keep each part clear and simple." },
          { label: "Store", detail: "Save it as a structured set." },
        ],
      },
      { type: "prose", text: "You’re not judging or solving — just structuring." },
    ],
  },
  {
    number: "III",
    label: "Using Sets",
    title: "Work through one thing\nat a time.",
    opening: "Once problems are structured, you don’t deal with everything — just the next step.",
    body: [
      { type: "prose", text: "Each set contains multiple small problems, but you only focus on one at a time." },
      { type: "prose", text: "This removes the pressure of handling everything together." },
      { type: "insight", label: "Key idea", text: "Progress happens step by step, not all at once." },
      { type: "prose", text: "Some steps will work, some won’t. That’s expected." },
      { type: "pullquote", text: "You move forward, not all at once — but continuously." },
    ],
  },
  {
    number: "IV",
    label: "Handling Blocks",
    title: "When something stops you,\nextract it.",
    opening: "Sometimes you can’t move forward. That’s not failure — it’s a signal.",
    body: [
      { type: "prose", text: "When you feel stuck, there’s usually a specific thought or fear causing it." },
      { type: "prose", text: "Instead of forcing action, you isolate that block." },
      { type: "insight", label: "What to do", text: "Capture the exact thing that is stopping you." },
      { type: "prose", text: "Once extracted, it becomes a separate problem — not something mixed into everything else." },
      { type: "pullquote", text: "If it blocks you, it becomes its own problem." },
    ],
  },
  {
    number: "V",
    label: "Why This Works",
    title: "Separation reduces load.",
    opening: "Your mind handles clear, defined pieces better than undefined complexity.",
    body: [
      { type: "prose", text: "When problems are separated, they stop interfering with each other." },
      { type: "prose", text: "This reduces confusion and makes action more direct." },
      { type: "insight", label: "Effect", text: "Less mental load, more clarity." },
      { type: "prose", text: "You’re no longer reacting to everything — just handling one defined part." },
      { type: "pullquote", text: "Clear problems are easier to act on." },
    ],
  },
  {
    number: "VI",
    label: "System Design",
    title: "Built to stay simple.",
    opening: "The system avoids adding extra layers or pressure.",
    body: [
      {
        type: "principles",
        items: [
          { title: "No forced solutions", body: "You define problems. Solutions come separately." },
          { title: "No emotional dependency", body: "You don’t need to describe feelings." },
          { title: "No tracking pressure", body: "Use it when needed. No streaks." },
          { title: "User-controlled", body: "You decide what stays private or shared." },
        ],
      },
      { type: "prose", text: "The goal is to reduce complexity, not add to it." },
      { type: "closing", text: `"Break. Separate. Move."` },
    ],
  },
];

function renderBlock(block, i) {
  if (block.type === 'prose') return (
    <p key={i} className="text-[#7a7a82] text-[1.08rem] leading-[1.85] font-light tracking-[0.005em] m-0">
      {block.text}
    </p>
  )

  if (block.type === 'insight') return (
    <div key={i} className="border-l-2 border-teal-400 pl-6 my-1">
      <p className="text-[0.7rem] font-medium tracking-[0.18em] uppercase text-teal-400 opacity-80 m-0 mb-[0.6rem]">
        {block.label}
      </p>
      <p className="text-[#c8c8cc] text-base leading-[1.75] m-0">
        {block.text}
      </p>
    </div>
  )

  if (block.type === 'pullquote') return (
    <p key={i} className="font-serif text-[1.35rem] leading-[1.55] text-[#e8e8e6] italic tracking-[-0.01em] my-1">
      {block.text}
    </p>
  )

  if (block.type === 'steps') return (
    <div key={i} className="flex flex-col">
      {block.items.map((item, j) => (
        <div key={j} className={`flex gap-5 items-start py-[1.1rem] ${j < block.items.length - 1 ? 'border-b border-white/5' : ''}`}>
          <span className="font-serif text-[0.75rem] text-teal-400 opacity-50 italic pt-[3px] shrink-0 min-w-[16px]">
            {j + 1}
          </span>
          <div>
            <p className="m-0 mb-[3px] text-[0.9rem] font-medium text-[#d4d4d8] tracking-[0.01em]">{item.label}</p>
            <p className="m-0 text-[0.88rem] text-[#6a6a72] leading-[1.65] font-light">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )

  if (block.type === 'principles') return (
    <div key={i} className="flex flex-col gap-6">
      {block.items.map((item, j) => (
        <div key={j}>
          <p className="m-0 mb-[0.3rem] text-[0.85rem] font-medium text-[#c8c8cc] tracking-[0.02em]">{item.title}</p>
          <p className="m-0 text-[0.95rem] text-[#6a6a72] leading-[1.7] font-light">{item.body}</p>
        </div>
      ))}
    </div>
  )

  if (block.type === 'closing') return (
    <div key={i} className="border-t border-white/[0.06] pt-12 mt-4 text-center">
      <p className="font-serif text-[1.15rem] italic text-[#9a9aa2] leading-[1.6] max-w-[480px] mx-auto mb-4">
        {block.text}
      </p>
      <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#3a3a42]">Probliq</span>
    </div>
  )

  return null
}

export default function ProbliqGuide() {
  const [active, setActive] = useState(0)
  const chapterRefs = useRef([])

  const navigateTo = (i) => {
    setActive(i)
    setTimeout(() => {
      chapterRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <div className="bg-[#0a0a0c] min-h-screen antialiased" style={{ fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif' }}>

      {/* Masthead */}
      <header className="border-b border-white/5 px-8 md:px-20 lg:px-32 pt-14 pb-10">
        <div className="flex items-end justify-between gap-12">

          {/* Left: publication identity */}
          <div>
            <p className="text-[0.65rem] tracking-[0.22em] uppercase text-teal-400 opacity-60 font-medium m-0 mb-[0.4rem]">
              Probliq
            </p>
            <h1 className="font-serif text-6xl font-normal text-zinc-400 italic leading-tight m-0">
              The Guide to<br />Social Autonomy
            </h1>
            <p className="text-[0.62rem] tracking-[0.14em] uppercase text-zinc-400 font-medium mt-3 m-0">
              Four chapters · Anxiety, observation &amp; grit
            </p>
          </div>

          {/* Right: contents index */}
          <nav className="hidden md:flex flex-col items-end gap-[6px] pb-1 shrink-0">
            <p className="text-[0.60rem] tracking-[0.2em] font-bold uppercase text-teal-100 font-medium mb-2 m-0">
              Contents
            </p>
            {chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => navigateTo(i)}
                className={`flex items-center gap-3 bg-transparent border-0 p-0 cursor-pointer transition-all duration-300 ${active === i ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}
              >
                <span className={`text-xs font-bold tracking-[0.14em] uppercase font-medium transition-colors duration-300 ${active === i ? 'text-teal-100' : 'text-zinc-100]'}`}>
                  {ch.label}
                </span>
                <span className={`font-serif text-xs font-bold italic transition-colors duration-300 ${active === i ? 'text-teal-400 opacity-60' : 'text-zinc-100'}`}>
                  {ch.number}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Chapters */}
      <main className="px-8 md:px-20 lg:px-32 pb-32">
        {chapters.map((chapter, i) => {
          const isActive = active === i
          return (
            <article
              key={i}
              ref={el => chapterRefs.current[i] = el}
              onClick={!isActive ? () => navigateTo(i) : undefined}
              className={`border-t border-white/[0.06] py-16 scroll-mt-4 ${!isActive ? 'cursor-pointer' : ''}`}
            >
              {/* Chapter marker */}
              <div className="flex items-center gap-4 mb-10">
                <span className={`font-serif text-[0.75rem] italic tracking-[0.05em] text-teal-400 transition-opacity duration-500 ${isActive ? 'opacity-70' : 'opacity-30'}`}>
                  {chapter.number}
                </span>
                <span className={`w-6 h-px block shrink-0 transition-all duration-500 ${isActive ? 'bg-teal-400/40' : 'bg-white/[0.08]'}`} />
                <span className={`text-[0.65rem] tracking-[0.18em] uppercase font-medium transition-colors duration-500 ${isActive ? 'text-teal-400' : 'text-[#3a3a44]'}`}>
                  {chapter.label}
                </span>
              </div>

              {/* Title */}
              <h2
                className={`font-serif font-normal whitespace-pre-line leading-[1.18] tracking-[-0.02em] mb-6 transition-all duration-500 ${
                  isActive
                    ? 'text-[#f0f0ee] text-[clamp(1.9rem,4vw,3rem)]'
                    : 'text-[#3a3a44] text-[clamp(1.3rem,2.5vw,1.8rem)]'
                }`}
              >
                {chapter.title}
              </h2>

              {/* Opening — teaser when collapsed */}
              <p className={`font-serif italic leading-[1.65] tracking-[0.005em] m-0 transition-all duration-500 ${isActive ? 'text-[#9a9aa2] text-[1.15rem]' : 'text-[#3a3a44] text-[0.95rem]'}`}>
                {chapter.opening}
              </p>

              {/* Expandable body */}
              <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col gap-8 pt-10">
                  {chapter.body.map((block, j) => renderBlock(block, j))}
                </div>
              </div>

              {/* Read hint */}
              {!isActive && (
                <p className="text-[0.75rem] text-[#2a2a32] mt-4 tracking-[0.05em] m-0">
                  Click to read →
                </p>
              )}
            </article>
          )
        })}
      </main>
    </div>
  )
}