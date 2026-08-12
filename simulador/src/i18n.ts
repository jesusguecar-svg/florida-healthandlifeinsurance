import type { Difficulty } from './types';

/**
 * Single source of truth for every student-facing string that is not part of
 * the question bank or the domain catalogue. The platform language is Spanish.
 */
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Mediano',
  hard: 'Difícil',
};

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];

export const T = {
  appName: 'Simulador de Salud y Vida de Florida',
  appSubtitle:
    'Agente de Salud y Vida de Florida (incluye anualidades y contratos variables)',
  nav: {
    dashboard: 'Panel principal',
    practice: 'Configurar práctica',
    session: 'Sesión en curso',
    results: 'Resultados',
    analytics: 'Rendimiento',
    review: 'Revisión',
  },
  dashboard: {
    title: 'Panel principal',
    welcome: 'Tu preparación de un vistazo',
    startExam: 'Iniciar simulacro completo',
    startPractice: 'Configurar práctica',
    resumeSession: 'Reanudar sesión en curso',
    quickPractice: 'Práctica rápida (20 preguntas)',
    reviewMissed: 'Repasar preguntas falladas',
    bankSize: 'Preguntas en el banco',
    answered: 'Preguntas contestadas',
    accuracy: 'Precisión acumulada',
    sessions: 'Sesiones completadas',
    domainProgress: 'Dominio por dominio',
    weight: 'Peso oficial',
    items: 'Preguntas',
    mastery: 'Precisión',
    coverage: 'Cobertura',
    noData: 'Aún sin datos',
    emptyState:
      'Todavía no has completado ninguna sesión. Comienza con una práctica rápida o con un simulacro completo para generar tus estadísticas.',
    practiceDomain: 'Practicar',
    examBlueprint: 'Estructura del examen oficial',
    examBlueprintDetail:
      '150 preguntas puntuadas más 15 preguntas de prueba previa · 2 horas 45 minutos · se aprueba con 70 %.',
  },
  config: {
    title: 'Configuración de práctica',
    subtitle:
      'Elige los dominios, la dificultad y el formato de tu sesión de estudio.',
    mode: 'Modo de sesión',
    modePractice: 'Práctica',
    modePracticeHelp:
      'Puedes ver la explicación inmediatamente después de contestar.',
    modeExam: 'Simulacro de examen',
    modeExamHelp:
      'Sin explicaciones hasta el final, con temporizador y estructura oficial.',
    domains: 'Dominios',
    selectAll: 'Seleccionar todos',
    clearAll: 'Quitar todos',
    proportional: 'Distribución proporcional al examen oficial',
    difficulty: 'Dificultad',
    questionCount: 'Número de preguntas',
    timeLimit: 'Límite de tiempo (minutos)',
    noTimeLimit: 'Sin límite de tiempo',
    instantFeedback: 'Mostrar la explicación al contestar',
    onlyMissed: 'Solo preguntas que fallé anteriormente',
    available: 'Preguntas disponibles con estos filtros',
    start: 'Comenzar sesión',
    cancel: 'Cancelar',
    warningNoDomain: 'Selecciona al menos un dominio para continuar.',
    warningNoDifficulty: 'Selecciona al menos un nivel de dificultad.',
    warningNoQuestions:
      'No hay preguntas disponibles con los filtros seleccionados. Ajusta los dominios, la dificultad o desactiva el filtro de preguntas falladas.',
    warningFewer:
      'Solo hay {n} preguntas disponibles con estos filtros; la sesión usará esa cantidad.',
    activeSessionWarning:
      'Tienes una sesión en curso. Si comienzas otra, se perderá el progreso de la sesión anterior.',
  },
  session: {
    question: 'Pregunta',
    of: 'de',
    flag: 'Marcar para revisar',
    flagged: 'Marcada',
    unflag: 'Quitar marca',
    highlight: 'Resaltar selección',
    clearHighlights: 'Quitar resaltados',
    highlightHelp:
      'Selecciona texto del enunciado y pulsa «Resaltar selección».',
    strike: 'Tachar',
    unstrike: 'Restaurar',
    strikeHelp: 'Tacha las opciones que quieras descartar.',
    previous: 'Anterior',
    next: 'Siguiente',
    finish: 'Finalizar sesión',
    submitAnswer: 'Comprobar respuesta',
    timeLeft: 'Tiempo restante',
    timeElapsed: 'Tiempo transcurrido',
    noTimer: 'Sin temporizador',
    navigator: 'Navegador de preguntas',
    legendAnswered: 'Contestada',
    legendUnanswered: 'Sin contestar',
    legendFlagged: 'Marcada',
    legendCurrent: 'Actual',
    correct: 'Respuesta correcta',
    incorrect: 'Respuesta incorrecta',
    yourAnswer: 'Tu respuesta',
    correctAnswer: 'Respuesta correcta',
    explanation: 'Explicación',
    whyWrong: 'Por qué las demás opciones son incorrectas',
    reference: 'Referencia',
    confirmFinishTitle: 'Finalizar la sesión',
    confirmFinishBody:
      'Vas a finalizar la sesión. Quedan {n} preguntas sin contestar; se calificarán como incorrectas.',
    confirmFinishBodyAll:
      'Has contestado todas las preguntas. ¿Quieres finalizar y ver tus resultados?',
    confirmFinish: 'Sí, finalizar',
    keepGoing: 'Seguir practicando',
    timeUpTitle: 'Se acabó el tiempo',
    timeUpBody:
      'El límite de tiempo terminó. La sesión se calificó automáticamente con las respuestas registradas.',
    abandon: 'Descartar sesión',
    confirmAbandonTitle: 'Descartar la sesión',
    confirmAbandonBody:
      'Se perderá todo el progreso de esta sesión y no se guardará en tus estadísticas.',
    confirmAbandon: 'Sí, descartar',
    unansweredNotice: 'Sin contestar',
  },
  results: {
    title: 'Resultados de la sesión',
    score: 'Puntuación',
    correct: 'Correctas',
    incorrect: 'Incorrectas',
    unanswered: 'Sin contestar',
    duration: 'Duración',
    passed: 'Aprobado',
    failed: 'No aprobado',
    passMark: 'Nota de aprobación: 70 %',
    byDomain: 'Desglose por dominio',
    byDifficulty: 'Desglose por dificultad',
    reviewAnswers: 'Revisar respuestas',
    backToDashboard: 'Volver al panel principal',
    repeatMissed: 'Practicar las falladas de esta sesión',
    strongAreas: 'Áreas más sólidas',
    weakAreas: 'Áreas por reforzar',
    noWeakAreas: 'Sin áreas críticas en esta sesión.',
  },
  review: {
    title: 'Revisión de la sesión',
    filterAll: 'Todas',
    filterCorrect: 'Correctas',
    filterIncorrect: 'Incorrectas',
    filterFlagged: 'Marcadas',
    filterUnanswered: 'Sin contestar',
    empty: 'No hay preguntas que coincidan con este filtro.',
    back: 'Volver a los resultados',
  },
  analytics: {
    title: 'Rendimiento',
    subtitle: 'Analítica acumulada de todas tus sesiones guardadas.',
    overall: 'Precisión global',
    totalAnswered: 'Respuestas registradas',
    totalSessions: 'Sesiones',
    lastSessions: 'Historial de sesiones',
    byDomain: 'Precisión por dominio',
    byDifficulty: 'Precisión por dificultad',
    date: 'Fecha',
    session: 'Sesión',
    result: 'Resultado',
    empty:
      'Todavía no hay datos de rendimiento. Completa una sesión para ver tu analítica.',
    resetTitle: 'Borrar todo el progreso',
    resetBody:
      'Se eliminarán todas tus sesiones, estadísticas e historial guardados en este navegador. Esta acción no se puede deshacer.',
    reset: 'Borrar progreso',
    confirmReset: 'Sí, borrar todo',
    cancel: 'Cancelar',
  },
  common: {
    cancel: 'Cancelar',
    close: 'Cerrar',
    domain: 'Dominio',
    subdomain: 'Subdominio',
    difficulty: 'Dificultad',
    allDomains: 'Todos los dominios',
    questions: 'preguntas',
    minutes: 'minutos',
    yes: 'Sí',
    no: 'No',
  },
  a11y: {
    mainNav: 'Navegación principal',
    questionNav: 'Ir a la pregunta {n}',
    optionLabel: 'Opción {id}',
    strikeOption: 'Tachar la opción {id}',
    unstrikeOption: 'Restaurar la opción {id}',
    flagQuestion: 'Marcar esta pregunta para revisarla más tarde',
    unflagQuestion: 'Quitar la marca de revisión de esta pregunta',
    progress: 'Progreso de la sesión',
    timer: 'Temporizador de la sesión',
  },
};

export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  );
}
