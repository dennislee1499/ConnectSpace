import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const colors = [
  "bg-[#3b4a6b] text-[#70a1ff] border-[1px] border-[#1e90ff]",  
  "bg-[#4a3b6b] text-[#a170ff] border-[1px] border-[#7f1eff]",  
  "bg-[#3b6b4a] text-[#70ffa1] border-[1px] border-[#1eff90]",  
  "bg-[#6b4a3b] text-[#ffb570] border-[1px] border-[#ff901e]",
]; 

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color]; 
  }
  return colors[0];
}