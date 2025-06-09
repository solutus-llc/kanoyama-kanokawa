<template>
  <span 
    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    :class="typeClasses"
  >
    <Icon :name="typeIcon" class="w-3 h-3 mr-1" />
    {{ typeLabel }}
  </span>
</template>

<script setup>
const props = defineProps(['product'])
const { categorizePurchaseType } = useRecommendations()

const spendingType = computed(() => categorizePurchaseType(props.product))

const typeConfig = {
  consumption: {
    label: '消費',
    icon: 'heroicons:shopping-cart',
    classes: 'bg-blue-100 text-blue-800'
  },
  waste: {
    label: '浪費',
    icon: 'heroicons:gift',
    classes: 'bg-orange-100 text-orange-800'
  },
  investment: {
    label: '投資',
    icon: 'heroicons:arrow-trending-up',
    classes: 'bg-green-100 text-green-800'
  }
}

const config = computed(() => typeConfig[spendingType.value])

const typeLabel = computed(() => config.value.label)
const typeIcon = computed(() => config.value.icon)
const typeClasses = computed(() => config.value.classes)
</script>