// src/types/index.ts
export interface Show {
  id: number;
  name: string;
  genres: string[];
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string | null;
  premiered: string | null;
  rating: {
    average: number | null;
  };
  language: string | null;
  runtime: number | null;
  status: string | null;
  network: {
    name: string;
  } | null;
  // Add other properties as needed
}

export interface SearchResult {
  score: number;
  show: Show;
}
