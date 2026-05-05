import prisma from '@/lib/prisma/client'

export async function MilestonesSeeder() {
  try {
    await prisma.milestone.deleteMany()

    const MILESTONES = [
      {
        rank: 1,
        name: 'Copper Observer',
        description: 'Starting Rank',
        requiredCount: 0,
        color: 'orange',
      },
      {
        rank: 2,
        name: 'Iron Witness',
        description: 'Reached after consistent observation',
        requiredCount: 10,
        color: 'zinc',
      },
      {
        rank: 3,
        name: 'Silver Sentinel',
        description: 'Strong pattern awareness forming',
        requiredCount: 50,
        color: 'teal',
      },
      {
        rank: 4,
        name: 'Gold Archivist',
        description: 'Deep consistency and structured logging',
        requiredCount: 100,
        color: 'yellow',
      },
      {
        rank: 5,
        name: 'Void Walker',
        description: 'Extreme discipline and long-term tracking',
        requiredCount: 500,
        color: 'purple',
      },
    ]

    const seen = new Set()
    for (const m of MILESTONES) {
      if (seen.has(m.rank)) {
        throw new Error(`Duplicate rank found: ${m.rank}`)
      }
      seen.add(m.rank)
    }

    await prisma.milestone.createMany({
      data: MILESTONES,
    })

    console.log('Milestones seeded successfully')
  } catch (err) {
    console.error('Failure while seeding milestones:', err)
  } finally {
    await prisma.$disconnect()
  }
}