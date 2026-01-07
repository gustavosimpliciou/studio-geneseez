import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WizardProgress } from "@/components/WizardProgress";
import { useProject } from "@/hooks/use-project";
import { Loader2, Play, ArrowLeft, ArrowRight, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SceneData } from "@shared/schema";

export default function Step3Animation() {
  const [, setLocation] = useLocation();
  const { project, animateScene, updateProject } = useProject();
  const { toast } = useToast();

  const [scenes, setScenes] = useState<SceneData[]>(project?.storyboard?.scenes || []);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const handleAnimate = (scene: SceneData) => {
    if (scene.videoUrl) return; // Already animated
    setAnimatingId(scene.id);

    animateScene.mutate(scene.id, {
      onSuccess: (data) => {
        setScenes(prev => prev.map(s => 
          s.id === scene.id ? { ...s, videoUrl: data.videoUrl } : s
        ));
        setAnimatingId(null);
      },
      onError: () => {
        setAnimatingId(null);
        toast({
          title: "Animation Failed",
          description: "Could not animate this scene.",
          variant: "destructive"
        });
      }
    });
  };

  const handleNext = () => {
    updateProject.mutate({
      storyboard: {
        story: project?.storyboard?.story || "",
        scenes
      }
    }, {
      onSuccess: () => {
        setLocation("/wizard/export");
      }
    });
  };

  const allAnimated = scenes.length > 0 && scenes.every(s => s.videoUrl);

  return (
    <Layout>
      <WizardProgress currentStep={3} totalSteps={4} />

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Bring Scenes to Life</h2>
          <p className="text-zinc-400">Generate animation clips for each storyboard scene.</p>
        </div>

        <div className="space-y-6">
          {scenes.map((scene, idx) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Preview Area */}
              <div className="w-full md:w-64 aspect-video bg-black rounded-lg overflow-hidden relative shrink-0">
                {scene.videoUrl ? (
                  <video 
                    src={scene.videoUrl} 
                    className="w-full h-full object-cover" 
                    controls 
                    loop 
                    muted 
                  />
                ) : (
                  <>
                    <img 
                      src={scene.imageUrl} 
                      alt="Scene preview" 
                      className="w-full h-full object-cover opacity-60" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {animatingId === scene.id ? (
                        <div className="bg-black/80 rounded-full p-3 backdrop-blur-sm">
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        </div>
                      ) : (
                        <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                          <Film className="w-6 h-6 text-white/50" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Details & Action */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                    SCENE {idx + 1}
                  </span>
                  <span className="text-xs text-zinc-500">Duration: ~5s</span>
                </div>
                <p className="text-sm text-zinc-300">{scene.description}</p>
              </div>

              <div className="shrink-0">
                {scene.videoUrl ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-400/10 px-4 py-2 rounded-lg">
                    <Play className="w-4 h-4 fill-current" />
                    Ready
                  </div>
                ) : (
                  <button
                    onClick={() => handleAnimate(scene)}
                    disabled={!!animatingId}
                    className="btn-secondary w-full md:w-auto"
                  >
                    {animatingId === scene.id ? "Rendering..." : "Animate"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-white/10">
          <button 
            onClick={() => setLocation("/wizard/storyboard")}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!allAnimated || updateProject.isPending}
            className={`flex items-center gap-2 px-8 ${allAnimated ? "btn-primary" : "btn-secondary opacity-50 cursor-not-allowed"}`}
          >
            Next: Finalize
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
