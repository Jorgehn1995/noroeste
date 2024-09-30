<template>
  <div>
    <v-main>
      <router-view :key="$route.fullPath"></router-view>
      <v-footer color="transparent">
        <v-container class="py-5">

          <v-card color="transparent" class="text-center caption" elevation="0">
            © Desarrollado por Estudiantes de UMG Jalapa.
            <br>
            Curso Investigación de Operaciones

          </v-card>
        </v-container>
      </v-footer>
    </v-main>
  </div>
</template>
<script>
import config from '@/configs'
export default {
  data() {
    return {
      config,
      links: [{
        label: 'Overview',
        to: '#'
      }, {
        label: 'Features',
        to: '#'
      }, {
        label: 'Pricing',
        to: '#'
      }, {
        label: 'Documentation',
        to: '#'
      }, {
        label: 'News',
        to: '#'
      }, {
        label: 'FAQ',
        to: '#'
      }, {
        label: 'About us',
        to: '#'
      }, {
        label: 'Carrers',
        to: '#'
      }, {
        label: 'Press',
        to: '#'
      }]
    }
  }
}
</script>
