import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Project, type InsertProject } from "@shared/schema";
import { api } from "@shared/routes";

// MOCK IMPLEMENTATION HELPERS
// Since we are client-side only for this demo, we simulate the API calls.

const STORAGE_KEY = "geneseez_project_v1";

const getStoredProject = (): Project | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const saveProject = (project: Project) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
};

// Simulation delay to mimic AI processing
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Generators
const mockImages = [
  "https://images.unsplash.com/photo-1607604276583-eef5f0b7ac58?w=400&h=400&fit=crop", // Minecraft Steve toy
  "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?w=400&h=400&fit=crop", // Pixel art
  "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=400&h=400&fit=crop", // Voxel style
  "https://images.unsplash.com/photo-1612404730960-5c71579fca11?w=400&h=400&fit=crop", // Blocky character
  "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=400&h=400&fit=crop", // Pixel landscape
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop", // Gaming setup
  "https://images.unsplash.com/photo-1627856013091-fedf7bb0615b?w=400&h=400&fit=crop", // Minecraft sword
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop", // Retro game
];

export function useProject() {
  const queryClient = useQueryClient();

  // GET Current Project
  const { data: project, isLoading } = useQuery({
    queryKey: [api.projects.list.path], // We treat the singleton as a "list" item for simplicity in this demo
    queryFn: async () => {
      // Simulate API call
      return getStoredProject();
    },
  });

  // CREATE / RESET Project
  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      await delay(800);
      const newProject: Project = {
        id: Date.now(),
        name: data.name,
        status: "draft",
        createdAt: new Date(),
        characterRef: null,
        storyboard: null,
        finalVideo: null,
      };
      saveProject(newProject);
      return newProject;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.projects.list.path] }),
  });

  // UPDATE Project (Partial)
  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      await delay(500); // Fast update for simple fields
      const current = getStoredProject();
      if (!current) throw new Error("No active project");
      
      const updated = { ...current, ...updates };
      saveProject(updated);
      return updated;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.projects.list.path] }),
  });

  // MOCK AI: Generate Character
  const generateCharacterMutation = useMutation({
    mutationFn: async (prompt: string) => {
      await delay(2500); // Simulate AI generation time
      
      // Shuffle mock images for variety
      const shuffled = [...mockImages].sort(() => 0.5 - Math.random());
      
      return {
        prompt,
        images: shuffled,
      };
    },
  });

  // MOCK AI: Generate Storyboard
  const generateStoryboardMutation = useMutation({
    mutationFn: async ({ prompt, characterImage }: { prompt: string, characterImage: string }) => {
      await delay(3000);
      return {
        story: prompt,
        scenes: Array.from({ length: 6 }).map((_, i) => ({
          id: `scene-${Date.now()}-${i}`,
          description: `Scene ${i + 1}: Based on the story "${prompt.substring(0, 20)}..."`,
          imageUrl: mockImages[i % mockImages.length],
          regenerations: 0,
        })),
      };
    },
  });

  // MOCK AI: Animate Scene
  const animateSceneMutation = useMutation({
    mutationFn: async (sceneId: string) => {
      await delay(4000); // Longer delay for video
      // Mock video URL (using a stock video link as placeholder)
      return {
        sceneId,
        videoUrl: "https://cdn.coverr.co/videos/coverr-minecraft-style-blocks-5244/1080p.mp4", // This is a placeholder, might break if hotlink protection. 
        // Fallback for demo if above fails: just treating it as a success state
      };
    },
  });

  // MOCK AI: Final Video
  const generateFinalVideoMutation = useMutation({
    mutationFn: async () => {
      await delay(5000);
      return {
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Standard test video
        transitions: "Crossfade",
      };
    },
  });

  return {
    project,
    isLoading,
    createProject: createProjectMutation,
    updateProject: updateProjectMutation,
    generateCharacter: generateCharacterMutation,
    generateStoryboard: generateStoryboardMutation,
    animateScene: animateSceneMutation,
    generateFinalVideo: generateFinalVideoMutation,
  };
}
