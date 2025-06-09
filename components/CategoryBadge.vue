<template>
  <span 
    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    :class="categoryClasses"
  >
    <Icon :name="categoryIcon" class="w-3 h-3 mr-1" />
    {{ categoryLabel }}
  </span>
</template>

<script setup>
const props = defineProps(['category'])

const categoryConfig = {
  meat: {
    label: '肉類',
    icon: 'heroicons:fire',
    classes: 'bg-red-100 text-red-800'
  },
  seafood: {
    label: '海鮮',
    icon: 'heroicons:water',
    classes: 'bg-blue-100 text-blue-800'
  },
  rice: {
    label: 'お米',
    icon: 'heroicons:bowl-rice',
    classes: 'bg-yellow-100 text-yellow-800'
  },
  fruit: {
    label: 'フルーツ',
    icon: 'heroicons:apple',
    classes: 'bg-green-100 text-green-800'
  },
  vegetable: {
    label: '野菜',
    icon: 'heroicons:leaf',
    classes: 'bg-emerald-100 text-emerald-800'
  },
  sweets: {
    label: 'お菓子',
    icon: 'heroicons:cake',
    classes: 'bg-pink-100 text-pink-800'
  },
  drink: {
    label: '飲み物',
    icon: 'heroicons:glass-water',
    classes: 'bg-cyan-100 text-cyan-800'
  },
  craft: {
    label: '工芸品',
    icon: 'heroicons:gift',
    classes: 'bg-purple-100 text-purple-800'
  },
  experience: {
    label: '体験',
    icon: 'heroicons:ticket',
    classes: 'bg-indigo-100 text-indigo-800'
  },
  other: {
    label: 'その他',
    icon: 'heroicons:ellipsis-horizontal',
    classes: 'bg-gray-100 text-gray-800'
  }
}

const config = computed(() => categoryConfig[props.category] || categoryConfig.other)

const categoryLabel = computed(() => config.value.label)
const categoryIcon = computed(() => config.value.icon)
const categoryClasses = computed(() => config.value.classes)
</script>