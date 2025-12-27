<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.about.title"
    :description="page.about.description"
    :ui="{
      container: '!pt-0 !pb-20',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'description-no-balance text-left mt-3 text-sm sm:text-md lg:text-sm text-muted'
    }"
  />
</template>

<style scoped>

</style>
