import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * פונקציה לחישוב מדד סיכון אנליטי (Feature Engineering)
 * משלבת את סכום הבקשה וזמן ההמתנה בשימוש בשקלול ליניארי מנורמל.
 */
export const calculateRiskScore = (amount: number, daysPending: number): number => {
  // נירמול סכום (נניח שסכום מקסימלי סביר הוא 50,000 ש"ח)
  const normalizedAmount = Math.min(amount / 50000, 1);
  
  // נירמול זמן המתנה (90 יום הוא רף ה-SLA העליון)
  const normalizedDays = Math.min(daysPending / 90, 1);
  
  // שקלול ליניארי (הסתברותי): 40% משקל לסכום, 60% משקל לזמן ההמתנה
  const score = (normalizedAmount * 0.4 + normalizedDays * 0.6) * 100;
  
  return Math.round(score);
};