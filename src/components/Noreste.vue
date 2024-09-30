<template>
  <v-container>
    <!-- Encabezado -->
    <v-card outlined color="transparent" class="d-flex justify-center mb-2">
      <div class="d-flex">
        <div class="d-flex justify-center align-center">
          <v-avatar>
            <v-img src="/images/umg.png"></v-img>
          </v-avatar>
        </div>
        <div>
          <v-card-text>
            <h2 class="text-center">Grupo #3 - Esquina Noroeste</h2>
            <h4 class="text-center">Curso Investigación de Operaciones</h4>
          </v-card-text>
        </div>
      </div>
    </v-card>

    <!-- Stepper -->
    <v-stepper v-model="paso" vertical class="rounded-lg">
      <!-- Paso 1: Ofertas -->
      <v-stepper-step :complete="paso > 1" step="1">
        Ofertas
        <small v-if="paso > 1">{{ oferta.length }} ofertas ingresadas</small>
        <small v-else>Ingresa todas las ofertas</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-toolbar class="mb-2">
          <v-btn color="primary" outlined text @click="agregarOferta">
            <span v-if="$vuetify.breakpoint.smAndUp">Agregar Oferta</span>
            <v-icon :right="$vuetify.breakpoint.smAndUp">mdi-truck-fast-outline</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="cargarEjemplo">
            <span v-if="$vuetify.breakpoint.smAndUp">Cargar Ejemplo</span>
            <v-icon :right="$vuetify.breakpoint.smAndUp">mdi-table</v-icon>
          </v-btn>
          <v-btn class="ml-2" color="primary" @click="paso = 2" :disabled="!oferta.length">
            <span v-if="$vuetify.breakpoint.smAndUp">Siguiente</span>
            <v-icon :right="$vuetify.breakpoint.smAndUp">mdi-chevron-right</v-icon>
          </v-btn>
        </v-toolbar>
        <v-sheet class="d-flex justify-center flex-column align-center">
          <v-sheet v-if="!oferta.length" class="rounded-lg d-flex justify-center align-center flex-column" elevation="0"
            height="100" width="100%">
            <v-icon size="50" color="grey">mdi-truck-fast-outline</v-icon>
            <span class="caption">Agrega ofertas para continuar...</span>
          </v-sheet>
          <v-sheet v-else width="100%">
            <v-slide-y-transition class="py-0 d-flex flex-wrap" group tag="div" hide-on-leave>
              <v-sheet :width="dimension" v-for="(o, index) in oferta" :key="'oferta-' + index"
                class="pa-0 oferta px-2">
                <v-text-field :ref="'oferta' + index" v-model.number="oferta[index]" :label="'Oferta ' + (index + 1)"
                  type="number" class="rounded-lg campo" filled hide-spin-buttons append-outer-icon="mdi-close"
                  @focus="$event.target.select()" @click:append-outer="eliminarOferta(index)"></v-text-field>
              </v-sheet>
            </v-slide-y-transition>
          </v-sheet>
        </v-sheet>
      </v-stepper-content>

      <!-- Paso 2: Demandas -->
      <v-stepper-step :complete="paso > 2" step="2">
        Demandas
        <small v-if="paso > 2">{{ demanda.length }} demandas ingresadas</small>
        <small v-else>Ingresa todas las demandas</small>
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-toolbar class="mb-2">
          <v-btn color="primary" outlined text @click="agregarDemanda">
            <span v-if="$vuetify.breakpoint.smAndUp">Agregar Demanda</span>
            <v-icon :right="$vuetify.breakpoint.smAndUp">mdi-storefront-plus-outline</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="paso = 1">
            <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-chevron-left</v-icon>
            <span v-if="$vuetify.breakpoint.smAndUp">Atrás</span>
          </v-btn>
          <v-btn color="primary" class="ml-1" @click="generarMatrizCostos"
            :disabled="!oferta.length || !demanda.length || totalDemanda != totalOferta">
            <span v-if="$vuetify.breakpoint.smAndUp">Siguiente</span>
            <v-icon :right="$vuetify.breakpoint.smAndUp">mdi-chevron-right</v-icon>
          </v-btn>
        </v-toolbar>
        <v-alert type="info" text v-if="totalDemanda != totalOferta">
          El problema no está equilibrado. La suma de las ofertas y demandas debe ser igual.
          <strong>Ofertas:</strong> {{ totalOferta }}, <strong>Demandas:</strong> {{ totalDemanda }}
        </v-alert>
        <v-sheet class="d-flex justify-center flex-column align-center">
          <v-sheet v-if="!demanda.length" class="rounded-lg d-flex justify-center align-center flex-column"
            elevation="0" height="100" width="100%">
            <v-icon size="50" color="grey">mdi-storefront-plus-outline</v-icon>
            <span class="caption">Agrega demandas para continuar...</span>
          </v-sheet>
          <v-sheet v-else width="100%">
            <v-slide-y-transition class="py-0 d-flex flex-wrap" group tag="div" hide-on-leave>
              <v-sheet :width="dimension" v-for="(d, index) in demanda" :key="'demanda-' + index"
                class="pa-0 oferta px-2">
                <v-text-field :ref="'demanda' + index" v-model.number="demanda[index]" :label="'Demanda ' + (index + 1)"
                  type="number" class="rounded-lg campo" filled hide-spin-buttons append-outer-icon="mdi-close"
                  @focus="$event.target.select()" @click:append-outer="eliminarDemanda(index)"></v-text-field>
              </v-sheet>
            </v-slide-y-transition>
          </v-sheet>
        </v-sheet>
      </v-stepper-content>

      <!-- Paso 3: Matriz de Costos -->
      <v-stepper-step :complete="paso > 3" step="3">
        Matriz de Costos
        <small v-if="paso > 3">Costos ingresados</small>
        <small v-else>Ingresa los costos en la matriz</small>
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-toolbar class="mb-2">
          <h3>Ingresa Costos</h3>
          <v-spacer></v-spacer>
          <v-btn text @click="paso = 2">
            <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-chevron-left</v-icon>
            <span v-if="$vuetify.breakpoint.smAndUp">Atrás</span>
          </v-btn>
          <v-btn color="primary" class="ml-1" @click="calcularEsquinaNoroeste" :disabled="!datosCompletos">
            <span v-if="$vuetify.breakpoint.smAndUp">Siguiente</span>
            <v-icon :right="$vuetify.breakpoint.smAndUp">mdi-chevron-right</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row v-if="matrizCostos.length" class="mt-3">
          <v-col cols="12">
            <v-simple-table>
              <thead>
                <tr>
                  <th></th>
                  <th class="text-center" v-for="(d, index) in demanda" :key="'header-' + index">
                    Demanda {{ index + 1 }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fila, i) in matrizCostos" :key="'fila-' + i">
                  <td>Oferta {{ i + 1 }}</td>
                  <td v-for="(costo, j) in fila" :key="'costo-' + i + '-' + j">
                    <v-text-field style="min-width: 100px;" v-model.number="matrizCostos[i][j]" label="Costo"
                      type="number" hide-details filled class="rounded-lg campo pa-1" dense></v-text-field>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-stepper-content>

      <!-- Paso 4: Resultado -->
      <v-stepper-step :complete="paso == 4" step="4" color="green">
        Resultado
        <small>Visualiza los resultados</small>
      </v-stepper-step>
      <v-stepper-content step="4">
        <v-toolbar class="mb-2">
          <h3>Resultado</h3>
          <v-spacer></v-spacer>
          <v-btn text @click="paso = 3">
            <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-chevron-left</v-icon>
            <span v-if="$vuetify.breakpoint.smAndUp">Atrás</span>
          </v-btn>
          <v-btn color="green" dark class="ml-1" @click="nuevo">
            <span v-if="$vuetify.breakpoint.smAndUp">Nuevo</span>
            <v-icon :right="$vuetify.breakpoint.smAndUp">mdi-autorenew</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row>
          <!-- Tabla de Solución -->
          <v-col cols="12" sm="7" md="8">
            <v-simple-table>
              <thead>
                <tr>
                  <th></th>
                  <th class="text-center" v-for="(d, index) in demanda" :key="'sol-header-' + index">
                    <strong>Demanda {{ index + 1 }}</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fila, i) in solucion" :key="'sol-fila-' + i">
                  <td class="text-center">
                    <strong>Oferta {{ i + 1 }}</strong>
                  </td>
                  <td class="text-center px-0" v-for="(valor, j) in fila" :key="'sol-valor-' + i + '-' + j">
                    <v-sheet :color="valor > 0 ? 'green' : ''" :class="valor > 0 ? 'white--text font-weight-black' : ''"
                      class="d-flex justify-center align-center" height="100%" width="100%">
                      {{ valor }}
                    </v-sheet>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <!-- Detalles de Costos -->
          <v-col cols="12" sm="5" md="4">
            <v-simple-table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ref</th>
                  <th>Costo</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(fila, i) in solucion">
                  <template v-for="(valor, j) in fila">
                    <tr v-if="valor > 0" :key="'costo-' + i + '-' + j">
                      <td class="text-center"><strong>{{ i + 1 }}</strong></td>
                      <td>{{ `o${i + 1} ➔ d${j + 1}` }}</td>
                      <td class="text-center">{{ matrizCostos[i][j] }} × {{ valor }}</td>
                      <td class="text-center">{{ matrizCostos[i][j] * valor }}</td>
                    </tr>
                  </template>
                </template>
                <tr>
                  <td class="text-right" colspan="3"><strong>Total</strong></td>
                  <td class="text-center"><strong>{{ resultado }}</strong></td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
export default {
  name: 'EsquinaNoroeste',
  data() {
    return {
      paso: 1,
      oferta: [],
      demanda: [],
      matrizCostos: [],
      solucion: [],
      resultado: 0,
      ejemplo: false,
    };
  },
  computed: {
    datosCompletos() {
      return (
        this.oferta.length &&
        this.demanda.length &&
        this.matrizCostos.length &&
        this.oferta.every((o) => o > 0) &&
        this.demanda.every((d) => d > 0)
      );
    },
    dimension() {
      const dimensiones = {
        lg: '20%',
        md: '25%',
        sm: '33%',
        xs: '100%',
      };
      return dimensiones[this.$vuetify.breakpoint.name] || '100%';
    },
    totalOferta() {
      return this.oferta.reduce((a, b) => a + b, 0);
    },
    totalDemanda() {
      return this.demanda.reduce((a, b) => a + b, 0);
    },
  },
  methods: {
    agregarOferta() {
      this.oferta.push(0);
      this.$nextTick(() => {
        const index = this.oferta.length - 1;
        this.$refs['oferta' + index][0].focus();
      });
    },
    eliminarOferta(index) {
      this.oferta.splice(index, 1);
    },
    agregarDemanda() {
      this.demanda.push(0);
      this.$nextTick(() => {
        const index = this.demanda.length - 1;
        this.$refs['demanda' + index][0].focus();
      });
    },
    eliminarDemanda(index) {
      this.demanda.splice(index, 1);
    },
    generarMatrizCostos() {
      if (this.oferta.length && this.demanda.length) {
        if (!this.matrizCostos.length || !this.ejemplo) {
          this.matrizCostos = this.oferta.map(() => this.demanda.map(() => 0));
        }
        this.paso = 3;
      } else {
        this.$emit('error', 'Debe ingresar al menos una oferta y una demanda.');
      }
    },
    calcularEsquinaNoroeste() {
      // Verificar equilibrio
      if (this.totalOferta !== this.totalDemanda) {
        this.$emit('error', 'El problema no está equilibrado. Ajusta las ofertas y demandas.');
        return;
      }

      // Copias de ofertas y demandas
      let oferta = [...this.oferta];
      let demanda = [...this.demanda];
      let solucion = this.oferta.map(() => this.demanda.map(() => 0));

      let i = 0;
      let j = 0;

      while (i < oferta.length && j < demanda.length) {
        let min = Math.min(oferta[i], demanda[j]);
        solucion[i][j] = min;
        this.resultado += min * this.matrizCostos[i][j];

        oferta[i] -= min;
        demanda[j] -= min;

        if (oferta[i] === 0) i++;
        if (demanda[j] === 0) j++;
      }

      this.solucion = solucion;
      this.paso = 4;
    },
    cargarEjemplo() {
      this.oferta = [250, 250, 250, 250];
      this.demanda = [300, 175, 325, 130, 70];
      this.matrizCostos = [
        [14, 10, 8, 10, 12],
        [20, 5, 9, 12, 18],
        [15, 16, 8, 5, 10],
        [7, 10, 20, 8, 18],
      ];
      this.ejemplo = true;
      this.paso = 3;
    },
    nuevo() {
      this.paso = 1;
      this.ejemplo = false;
      this.oferta = [];
      this.demanda = [];
      this.matrizCostos = [];
      this.solucion = [];
      this.resultado = 0;
    },
  },
};
</script>

<style>
/* Estilos personalizados */
td {
  text-align: center;
  vertical-align: middle;
}

.text-center {
  text-align: center;
}

.campo .v-input__control .v-input__slot::before,
.campo .v-input__control .v-input__slot::after {
  border: 0 !important;
}
</style>
