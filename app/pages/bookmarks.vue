<script setup lang="ts">
type BookmarkType = 'article' | 'video' | 'course' | 'book' | 'tool' | 'repo'

interface Bookmark {
  title: string
  url: string
  type: BookmarkType
  category: string
  tags?: string[]
  logo?: string
}

interface BookmarksPage {
  title: string
  description: string
  seo?: {
    title?: string
    description?: string
  }
  bookmarks: Bookmark[]
}

const { data: page } = await useAsyncData('bookmarks', () => {
  return (queryCollection as any)('bookmarks').first() as Promise<BookmarksPage>
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Bookmarks page not found',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

const activeType = ref<BookmarkType | 'all'>('all')

type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

const typeConfig: Record<BookmarkType, { color: BadgeColor, icon: string }> = {
  article: { color: 'info', icon: 'i-lucide-file-text' },
  video: { color: 'error', icon: 'i-lucide-play' },
  course: { color: 'warning', icon: 'i-lucide-graduation-cap' },
  book: { color: 'secondary', icon: 'i-lucide-book-open' },
  tool: { color: 'success', icon: 'i-lucide-wrench' },
  repo: { color: 'neutral', icon: 'i-simple-icons-github' }
}

const allTypes = Object.keys(typeConfig) as BookmarkType[]

const availableTypes = computed(() => {
  const used = new Set((page.value?.bookmarks || []).map(b => b.type))
  return allTypes.filter(t => used.has(t))
})

const filteredGrouped = computed(() => {
  const bookmarks = page.value?.bookmarks || []
  const filtered = activeType.value === 'all'
    ? bookmarks
    : bookmarks.filter(b => b.type === activeType.value)

  const groups = filtered.reduce((acc: Record<string, Bookmark[]>, b) => {
    if (!acc[b.category]) acc[b.category] = []
    acc[b.category]!.push(b)
    return acc
  }, {})

  return Object.entries(groups).map(([category, items]) => ({ category, items }))
})

function getLogoUrl(bookmark: Bookmark): string {
  if (bookmark.logo) return bookmark.logo
  try {
    const domain = new URL(bookmark.url).hostname
    return `https://logo.clearbit.com/${domain}`
  } catch {
    return ''
  }
}

function handleLogoError(e: Event, bookmark: Bookmark): void {
  const img = e.target as HTMLImageElement
  try {
    const domain = new URL(bookmark.url).hostname
    const fallback = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    if (img.src !== fallback) {
      img.src = fallback
    }
  } catch {
    img.style.display = 'none'
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        container: '!pb-8',
        title: '!mx-0 text-left',
        description: '!mx-0 text-left'
      }"
    />

    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <!-- Type filter -->
      <div class="flex flex-wrap gap-2">
        <UButton
          size="sm"
          :variant="activeType === 'all' ? 'solid' : 'ghost'"
          color="neutral"
          label="All"
          @click="activeType = 'all'"
        />
        <UButton
          v-for="type in availableTypes"
          :key="type"
          size="sm"
          :variant="activeType === type ? 'solid' : 'ghost'"
          color="neutral"
          :leading-icon="typeConfig[type].icon"
          :label="capitalize(type)"
          @click="activeType = type"
        />
      </div>

      <!-- Category groups -->
      <div
        v-for="group in filteredGrouped"
        :key="group.category"
        class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 last:mb-0"
      >
        <!-- Left: sticky category label -->
        <div class="lg:col-span-1 mb-4 lg:mb-0">
          <div class="lg:sticky lg:top-16">
            <h2 class="text-xl font-semibold tracking-tight text-highlighted">
              {{ group.category }}
            </h2>
            <p class="text-sm text-muted mt-1">
              {{ group.items.length }} {{ group.items.length === 1 ? 'resource' : 'resources' }}
            </p>
          </div>
        </div>

        <!-- Right: 2-col grid of bookmark tiles -->
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Motion
            v-for="(bookmark, index) in group.items"
            :key="bookmark.url"
            :initial="{ opacity: 0, transform: 'translateY(8px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.07 * index }"
            :in-view-options="{ once: true }"
          >
            <NuxtLink
              :to="bookmark.url"
              target="_blank"
              class="block h-full"
            >
              <UCard
                variant="subtle"
                class="group h-full hover:ring-1 hover:ring-primary/50 transition-all duration-200 cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <!-- Logo -->
                  <div class="shrink-0 size-9 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img
                      :src="getLogoUrl(bookmark)"
                      :alt="bookmark.title"
                      class="size-6 object-contain"
                      @error="(e) => handleLogoError(e, bookmark)"
                    >
                  </div>

                  <!-- Title + badge -->
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-highlighted truncate group-hover:text-primary transition-colors duration-200">
                      {{ bookmark.title }}
                    </p>
                    <UBadge
                      :color="typeConfig[bookmark.type].color"
                      :leading-icon="typeConfig[bookmark.type].icon"
                      variant="subtle"
                      size="xs"
                      :label="capitalize(bookmark.type)"
                      class="mt-1.5"
                    />
                  </div>

                  <!-- External link indicator -->
                  <UIcon
                    name="i-lucide-external-link"
                    class="shrink-0 size-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
              </UCard>
            </NuxtLink>
          </Motion>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredGrouped.length === 0"
        class="text-center py-16 text-muted"
      >
        <UIcon
          name="i-lucide-bookmark-x"
          class="size-10 mx-auto mb-3 opacity-40"
        />
        <p class="text-sm">
          No bookmarks for this type yet.
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>
