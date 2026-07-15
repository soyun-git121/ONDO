import { get } from "./client";
import type { HomeData } from "../types/home";

export function getHome(): Promise<HomeData> {
  return get<HomeData>("/home");
}
