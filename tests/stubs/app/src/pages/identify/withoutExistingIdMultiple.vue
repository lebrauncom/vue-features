<template>
  <span
    v-for="(stub, index) in stubs.data"
    :key="stub"
    :ref="stubs.getRef(index)"
  >
    {{ stub }}
  </span>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUpdate, onMounted } from 'vue'
import { identify } from '../../../../../../src/affordances'
import { WithGlobals } from '../../../../../fixtures/types'

const els = ref([]),
      stubs = reactive({
        data: [0, 1, 2],
        getRef: index => el => els.value[index] = el 
      })

onBeforeUpdate(() => {
  els.value = []
})

const ids = identify({ element: els })

onMounted(() => (window as unknown as WithGlobals).testState =  { ids })
</script>
