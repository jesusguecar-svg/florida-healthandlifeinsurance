# Simulador de Salud y Vida de Florida

Simulador de examen **íntegramente en español** para la licencia de Agente de Salud y
Vida de Florida (incluye anualidades y contratos variables, licencia 2-15).

La plataforma completa que ve el estudiante —panel, navegación, dominios, subdominios,
enunciados, opciones, explicaciones, etiquetas de dificultad, temporizador, controles de
marcado, resaltado y tachado, resultados, analítica, revisión, avisos y mensajes de
error— está en español. Los identificadores de código, tipos de TypeScript, nombres de
función y comentarios de desarrollo están en inglés, conforme a la excepción técnica.

## Cómo ejecutarlo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # compilación de producción
npm run preview    # servir la compilación
npm test           # validación del banco de preguntas (1505 aserciones)
```

## Contenido y fuentes

- **Alcance de dominios y ponderaciones**: Esquemas de Contenido del Examen de Seguros de
  Florida, vigentes a partir del 1 de enero de 2026 (páginas S7–S11 del PDF `121003.pdf`
  incluido en el repositorio). El esquema oficial controla el alcance.
- **Investigación y terminología en español**: los expedientes de
  `spanish-research-dossiers/`. Cada archivo del banco cita, en su cabecera, el dossier
  correspondiente. El dossier `X IX Florida Field Underwriting Dossier Plan.es.md` se usa
  como investigación del **Dominio IX**, y el dossier titulado «II Domain II» cubre por su
  materia los estatutos de vida y anualidades, por lo que respalda los Dominios II y XI.
  Los dossiers no se modifican.

### Distribución del banco (250 preguntas)

| Dominio | Materia | Peso oficial | Preguntas |
| --- | --- | ---: | ---: |
| I | Tipos de pólizas de vida y características | 10 % | 25 |
| II | Cláusulas adicionales, disposiciones, opciones y exclusiones de la póliza de vida | 10 % | 25 |
| III | Cómo completar la solicitud de vida, suscribir y entregar las pólizas | 8 % | 20 |
| IV | Jubilación y otros conceptos del seguro de vida | 5 % | 13 |
| V | Tipos de pólizas de salud | 11 % | 27 |
| VI | Disposiciones, cláusulas y cláusulas adicionales de la póliza de salud | 10 % | 25 |
| VII | Seguro social | 4 % | 10 |
| VIII | Otros conceptos del seguro de salud | 4 % | 10 |
| IX | Procedimientos de suscripción de campo | 5 % | 12 |
| X | Estatutos y reglas de Florida comunes a todas las líneas | 13 % | 33 |
| XI | Estatutos y reglas de Florida sobre vida y anualidades | 10 % | 25 |
| XII | Estatutos y reglas de Florida sobre seguro de salud | 10 % | 25 |

Cada pregunta incluye enunciado, cuatro opciones, respuesta correcta, **una explicación
por cada opción** (por qué la correcta lo es y por qué falla cada distractor), etiqueta de
dificultad (`Fácil`, `Mediano`, `Difícil`) y referencia legal o de esquema.

## Funcionalidades del estudiante

- **Panel principal** con precisión acumulada, cobertura del banco y progreso por dominio.
- **Simulacro completo**: 150 preguntas puntuadas, 2 h 45 min, aprobación al 70 %, con
  selección proporcional al peso oficial de cada dominio.
- **Configuración de práctica**: modo, dominios, dificultad, número de preguntas, límite de
  tiempo, explicación inmediata y filtro de preguntas falladas.
- **Herramientas de examen**: temporizador, navegador de preguntas, marcado, resaltado del
  enunciado y tachado de opciones.
- **Resultados y revisión**: desglose por dominio y dificultad, áreas sólidas y por
  reforzar, revisión filtrable con todas las explicaciones.
- **Rendimiento**: analítica acumulada, historial de sesiones y borrado del progreso.

El progreso se guarda en `localStorage`, de modo que una sesión interrumpida puede
reanudarse.

## Estructura

```
src/
  types.ts                 Modelo de datos (identificadores técnicos en inglés)
  i18n.ts                  Todos los textos de interfaz en español
  data/domains.ts          Dominios, subdominios, pesos y estructura del examen
  data/questions/          Banco validado, un archivo por dominio + pruebas
  lib/session.ts           Selección de preguntas, creación y calificación de sesiones
  lib/stats.ts             Métricas, formatos y agregaciones
  lib/storage.ts           Persistencia en localStorage
  components/              Panel, configuración, sesión, resultados, revisión, analítica
```

## Aviso

Material educativo de preparación. No reproduce contenido confidencial del examen ni
constituye asesoría legal.

## Formas de usarlo

1. **Un solo archivo, sin instalar nada**

   ```bash
   npm run build:single
   ```

   Genera `dist-single/index.html`: la aplicación completa en un único archivo, que
   funciona abriéndolo directamente en el navegador (doble clic) o subiéndolo a
   cualquier alojamiento estático. El progreso se guarda en el navegador donde se abra.

2. **GitHub Pages (automático)**

   El flujo de trabajo `.github/workflows/deploy-simulador.yml` compila, valida y publica
   el simulador en cada `push`. Para activarlo la primera vez: en GitHub, **Settings →
   Pages → Source: GitHub Actions**. La dirección publicada será
   `https://<usuario>.github.io/florida-healthandlifeinsurance/`.

3. **En local**

   ```bash
   npm install && npm run dev
   ```
