import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WizardProgress } from "@/components/WizardProgress";
import { useProject } from "@/hooks/use-project";
import { Loader2, Clapperboard, RefreshCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SceneData } from "@shared/schema";

export default function Step2Storyboard() {
  const [, setLocation] = useLocation();
  const { project, generateStoryboard, updateProject } = useProject();
  const { toast } = useToast();

  const [story, setStory] = useState(project?.storyboard?.story || "");
  const [scenes, setScenes] = useState<SceneData[]>(project?.storyboard?.scenes || []);

  const handleGenerate = () => {
    if (!story) return;

    // We assume the character image is selected from previous step. 
    // In a real app we'd grab it properly from the array.
    const charImg = project?.characterRef?.images[0] || "";

    generateStoryboard.mutate({ prompt: story, characterImage: charImg }, {
      onSuccess: (data) => {
        setScenes(data.scenes);
        toast({
          title: "Storyboard Created",
          description: "Review your scenes below.",
        });
      }
    });
  };

  const handleNext = () => {
    if (scenes.length === 0) return;

    updateProject.mutate({
      storyboard: {
        story,
        scenes,
      }
    }, {
      onSuccess: () => {
        setLocation("/wizard/animation");
      }
    });
  };

  return (
    <Layout>
      <WizardProgress currentStep={2} totalSteps={4} />
      
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Create Storyboard</h2>
          <p className="text-zinc-400">Write your story. We'll break it down into key scenes.</p>
        </div>

        {/* Story Input */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Once upon a time in a blocky world far away..."
            className="input-field min-h-[120px] resize-none text-lg"
          />
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!story || generateStoryboard.isPending}
              className="btn-primary flex items-center gap-2"
            >
              {generateStoryboard.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Planning Scenes...
                </>
              ) : (
                <>
                  <Clapperboard className="w-5 h-5" />
                  Generate Scenes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scene Cards */}
        {scenes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {scenes.map((scene, idx) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition-colors"
                >
                  <div className="relative aspect-video bg-black">
                    <img src={scene.imageUrl} alt={scene.description} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-mono text-white/80">
                      SCENE {idx + 1}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-zinc-300 line-clamp-3">{scene.description}</p>
                    <div className="flex justify-end">
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors" title="Regenerate scene">
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-white/10">
          <button 
            onClick={() => setLocation("/wizard/character")}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {scenes.length > 0 && (
            <button
              onClick={handleNext}
              disabled={updateProject.isPending}
              className="btn-primary flex items-center gap-2"
            >
              Next: Animation
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
