<script setup lang="ts">
interface Paper {
  title: string
  date: string | Date
  location: string // conference location E.g. "ICITE 2025, HCM City, Vietnam"
  isarxiv: boolean // if papers is on arXiv --> link to arXiv
  url: string // either the local path or the arXiv link
  image?: string
}

interface PaperPage {
  title: string
  description: string
  seo?: {
    title?: string
    description?: string
  }
  links?: any[]
  papers: Paper[]
}

const { data: page } = await useAsyncData('papers', () => {
  return (queryCollection as any)('papers').first() as Promise<PaperPage>
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'papers page not found',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

// Group papers by year
const groupedPapers = computed(() => {
  const papers = page.value?.papers || []

  // Sort all papers by date descending first
  const sortedPapers = [...papers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const groups = sortedPapers.reduce((acc: Record<string, Paper[]>, paper: Paper) => {
    const year = new Date(paper.date).getFullYear().toString()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(paper)
    return acc
  }, {} as Record<string, Paper[]>)

  // Return as a sorted array to guarantee order in v-for
  return Object.entries(groups)
    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
    .map(([year, papers]) => ({
      year,
      papers
    }))
})

function formatDate(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <UButton
          v-if="page.links && page.links.length > 0"
          v-bind="page.links[0]"
          icon="i-lucide-graduation-cap"
          size="md"
        />
      </template>
    </UPageHero>

    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <div
        v-for="group in groupedPapers"
        :key="group.year"
        class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 mb-16 last:mb-0"
      >
        <div class="lg:col-span-1 mb-4 lg:mb-0">
          <h2 class="lg:sticky lg:top-16 text-xl font-semibold tracking-tight text-highlighted">
            {{ group.year }}
          </h2>
        </div>

        <div class="lg:col-span-2 space-y-12">
          <div
            v-for="(paper, index) in group.papers"
            :key="index"
            class="group relative pl-6 border-l border-default"
          >
            <NuxtLink
              v-if="paper.url"
              :to="paper.url"
              target="_blank"
              class="absolute inset-0 z-10"
            />

            <div class="mb-1 text-sm font-medium text-muted">
              <span>{{ paper.location }}</span>
              <span
                v-if="paper.location && paper.date"
                class="mx-1"
              >·</span>
              <span v-if="paper.date">{{ formatDate(paper.date) }}</span>
            </div>

            <h3 class="text-lg font-semibold text-highlighted group-hover:text-primary transition-colors">
              {{ paper.title }}
            </h3>

            <NuxtImg
              v-if="paper.image"
              :src="paper.image"
              :alt="paper.title"
              class="w-full mx-auto mt-4 mb-4 h-64 object-cover object-center rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
            />

            <UButton
              v-if="paper.url"
              target="_blank"
              :label="paper.isarxiv ? 'View on arXiv' : 'Read Paper'"
              variant="link"
              class="p-0 pt-2 gap-0 z-20"
            >
              <template #trailing>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4 transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                />
              </template>
            </UButton>
          </div>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
