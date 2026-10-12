import { UserProfile } from '@/types';

export interface CalorieBreakdown {
  bmr: number;
  maintenanceCalories: number;
  breastfeedingAllowance: number;
  safeDeficit: number;
  dailyTarget: number;
  macroTargets: {
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  hydrationTargetMl: number;
}

export function feetToCm(feet: number): number {
  return Math.round(feet * 30.48);
}

export function calculateDailyTargets(profile: UserProfile): CalorieBreakdown {
  const {
    age,
    weight,
    height,
    isBreastfeeding,
    activityLevel,
    dailyWaterTargetMl,
  } = profile;

  // Mifflin-St Jeor Equation for Women:
  // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
  const heightCm = feetToCm(height);
  const rawBmr = 10 * weight + 6.25 * heightCm - 5 * age - 161;
  const bmr = Math.round(rawBmr);

  // Activity Multipliers:
  const activityFactors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.3, // Typical for postpartum mom caring for child
    moderate: 1.45,
    active: 1.6,
  };
  const factor = activityFactors[activityLevel] || 1.3;
  const maintenanceCalories = Math.round(bmr * factor);

  // Lactation Energy Allowance:
  // WHO, ACOG & La Leche League recommend ~450-500 kcal/day for active milk synthesis.
  const breastfeedingAllowance = isBreastfeeding ? 450 : 0;

  // Safe Postpartum Weight Loss Deficit:
  // Gentle 350-400 kcal deficit preserves milk supply and prevents maternal fatigue.
  const safeDeficit = 400;

  // Target = Maintenance + Lactation Allowance - Deficit (minimum safe floor of 1800 kcal for breastfeeding mothers)
  let calculatedTarget = maintenanceCalories + breastfeedingAllowance - safeDeficit;
  if (isBreastfeeding && calculatedTarget < 1850) {
    calculatedTarget = 1850; // Guardrail to guarantee sufficient nutrition for nursing
  }
  const dailyTarget = Math.round(calculatedTarget);

  // Balanced Postpartum Macronutrient Split:
  // ~25% Protein, ~45% Complex Carbs, ~30% Healthy Fats
  const proteinCalories = dailyTarget * 0.25;
  const carbsCalories = dailyTarget * 0.45;
  const fatCalories = dailyTarget * 0.30;

  const macroTargets = {
    proteinG: Math.round(proteinCalories / 4),
    carbsG: Math.round(carbsCalories / 4),
    fatG: Math.round(fatCalories / 9),
  };

  const hydrationTargetMl = dailyWaterTargetMl || (isBreastfeeding ? 3200 : 2400);

  return {
    bmr,
    maintenanceCalories,
    breastfeedingAllowance,
    safeDeficit,
    dailyTarget,
    macroTargets,
    hydrationTargetMl,
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatMl(ml: number): string {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)}L`;
  }
  return `${ml}ml`;
}
