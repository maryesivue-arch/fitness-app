import { FoodItem } from '@/types';
import { NIGERIAN_FOOD_DATABASE } from './foodDatabase';

export interface VisionPrediction {
  suggestedFoodId: string;
  confidence: number;
  detectedLabels: string[];
  notes: string;
}

/**
 * Interface ready for future AI Vision API integration (e.g., Gemini 2.5 Flash Multimodal or custom edge ML).
 * Currently operates in MVP mode: acknowledges user food photo and returns candidate matches from the database.
 */
export async function analyzeFoodImage(
  imageDataUrl: string
): Promise<VisionPrediction[]> {
  // Simulates asynchronous round-trip to vision model (kept minimal and fast)
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Heuristic top matches for demonstration in MVP mode
  // In production, this forwards imageDataUrl to /api/vision or Gemini API endpoint
  const candidateIds = ['jollof-rice', 'egusi-soup', 'beans-porridge', 'amala'];
  const candidates: VisionPrediction[] = candidateIds
    .map((id, index) => {
      const food = NIGERIAN_FOOD_DATABASE.find((f) => f.id === id);
      return {
        suggestedFoodId: id,
        confidence: Math.round(92 - index * 14),
        detectedLabels: [food?.name || 'Local Meal', 'Nigerian Cuisine', food?.category || 'Plate'],
        notes: `Candidate visual match: ${food?.name}. Please confirm portion size.`,
      };
    })
    .filter((c) => Boolean(c.suggestedFoodId));

  return candidates;
}

export function isVisionApiConfigured(): boolean {
  // Returns false in current MVP mode to clearly communicate to user
  return false;
}
