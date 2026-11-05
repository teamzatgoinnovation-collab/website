"use client";

import { createContext } from "react";

/** The phone screen tells its screenshot how big it is, and the screenshot tells the phone its own shape. */
export type PhoneScreen = { screenRatio: number; report: (imageRatio: number) => void };
export const PhoneScreenContext = createContext<PhoneScreen | null>(null);
