
import { PodcastPoint } from './types';

export const INITIAL_TIME = 3600; // 1 hour total
export const DEFAULT_SEGMENT_DURATION = 300; // 5 minutes default

export const PODCAST_POINTS: PodcastPoint[] = [
  { id: '1', title: "Porque migramos", speaker: "Paola", durationSeconds: 400 },
  { id: '2', title: "Motivaciones para migrar", speaker: "Todas", durationSeconds: 600 },
  { id: '3', title: "No soy de aquí ni de allá", speaker: "Mai", durationSeconds: 300 },
  { id: '4', title: "Me adapto o sobrevivimos", speaker: "Mai", durationSeconds: 300 },
  { id: '5', title: "Fanatismo veneco", speaker: "Ori", durationSeconds: 400 },
  { id: '6', title: "¿Cómo reconocer un veneco en la calle?", speaker: "", durationSeconds: 300 },
  { id: '7', title: "¿Ser víctima, quejarse o ver lo positivo?", speaker: "", durationSeconds: 400 },
  { id: '8', title: "¿Qué sentimientos hay en la mochila de un migrante?", speaker: "", durationSeconds: 500 },
  { id: '9', title: "¿Regresaríamos?", speaker: "Todas", durationSeconds: 400 },
];

export const THEME = {
  beige: "#F5F2ED",
  black: "#1A1A1A",
  accent: "#E5E1D8"
};
