import { pgTable, text, serial, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Although the user requested a client-side only app using localStorage,
// we define these schemas to provide strong typing for the frontend to use.
// The frontend can treat these as the shapes of objects stored in localStorage.

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("draft"), // draft, completed
  createdAt: timestamp("created_at").defaultNow(),
  characterRef: jsonb("character_ref").$type<{
    prompt: string;
    images: string[]; // URLs of the 8 generated images
  }>(),
  storyboard: jsonb("storyboard").$type<{
    story: string;
    scenes: {
      id: string;
      description: string;
      imageUrl: string;
      videoUrl?: string; // For the animated step
      regenerations: number;
    }[];
  }>(),
  finalVideo: jsonb("final_video").$type<{
    transitions: string;
    videoUrl: string;
  }>(),
});

export const insertProjectSchema = createInsertSchema(projects);

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// Helper types for the wizard steps
export type WizardStep = "character" | "storyboard" | "animation" | "export";

export interface CharacterData {
  prompt: string;
  images: string[];
}

export interface SceneData {
  id: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  regenerations: number;
}

export interface StoryboardData {
  story: string;
  scenes: SceneData[];
}
