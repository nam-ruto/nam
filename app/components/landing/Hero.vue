<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { footer, global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.8,
          delay: 0.05
        }"
      >
        <div class="relative flex items-center justify-center">
          <!-- Glow ring behind avatar -->
          <div
            class="absolute size-44 rounded-full"
            style="background: radial-gradient(circle, var(--accent-glow-strong) 0%, var(--accent-glow) 50%, transparent 70%);"
          />
          <UColorModeAvatar
            class="relative size-32 ring-2 ring-primary/30 ring-offset-3 ring-offset-(--ui-bg) rounded-full"
            width="528"
            height="528"
            :light="global.picture?.light!"
            :dark="global.picture?.dark!"
            :alt="global.picture?.alt!"
          />
        </div>
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.8,
          delay: 0.15
        }"
      >
        <span class="gradient-text">{{ page.title }}</span>
      </Motion>
    </template>

    <template #description>
      <Motion
        class="italic max-w-xl mx-auto"
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.8,
          delay: 0.3
        }"
      >
        {{ page.description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.8,
          delay: 0.45
        }"
      >
        <div class="flex items-center gap-2">
          <UButton
            label="Download Resume"
            color="neutral"
            download="NamHoang_SE.pdf"
            href="/resume/NamHoang_SE.pdf"
            target="_blank"
            class="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
          />
          <UButton
            :color="global.available ? 'primary' : 'error'"
            variant="ghost"
            class="gap-2"
            :to="global.available ? global.githubLink : ''"
            :label="global.available ? 'Checking my new projects' : 'Not available at the moment'"
          >
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global.available ? 'bg-primary animate-ping' : 'bg-error'"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global.available ? 'bg-primary' : 'bg-error'"
                />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          v-for="(link, index) of footer?.links"
          :key="index"
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.5 + index * 0.1
          }"
        >
          <UButton
            v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
            class="transition-all duration-300 hover:scale-110 hover:text-primary"
          />
        </Motion>
      </div>
    </template>

    <!-- Image Marquee -->
    <!-- <UMarquee
      pause-on-hover
      class="py-4 -mx-8 sm:-mx-12 lg:-mx-16 [--duration:40s]"
    >
      <Motion
        v-for="(img, index) in page.hero.images"
        :key="index"
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: index * 0.1
        }"
      >
        <NuxtImg
          width="234"
          height="234"
          class="rounded-xl aspect-square object-cover shadow-lg transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:scale-105"
          :class="index % 2 === 0 ? '-rotate-2 hover:rotate-0' : 'rotate-2 hover:rotate-0'"
          v-bind="img"
        />
      </Motion>
    </UMarquee> -->
  </UPageHero>
</template>
