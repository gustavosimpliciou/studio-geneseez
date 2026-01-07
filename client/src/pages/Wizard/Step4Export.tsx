import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WizardProgress } from "@/components/WizardProgress";
import { useProject } from "@/hooks/use-project";
import { Loader2, Download, ArrowLeft, Video, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function Step4Export() {
  const [, setLocation] = useLocation();
  const { project, generateFinalVideo, updateProject } = useProject();
  const { toast } = useToast();
  const { width, height } = useWindowSize();

  const [isGenerating, setIsGenerating] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(project?.finalVideo?.videoUrl || null);
  const [progress, setProgress] = useState(0);

  const handleGenerateFull = () => {
    setIsGenerating(true);
    setProgress(0);

    // Fake progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return p;
        return p + Math.random() * 10;
      });
    }, 500);

    generateFinalVideo.mutate(undefined, {
      onSuccess: (data) => {
        clearInterval(interval);
        setProgress(100);
        setFinalVideoUrl(data.videoUrl);
        setIsGenerating(false);
        
        // Save state
        updateProject.mutate({
          status: "completed",
          finalVideo: {
            videoUrl: data.videoUrl,
            transitions: "Default Crossfade",
          }
        });
      },
      onError: () => {
        clearInterval(interval);
        setIsGenerating(false);
        toast({ title: "Error", description: "Failed to compile video." });
      }
    });
  };

  return (
    <Layout>
      {finalVideoUrl && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      <WizardProgress currentStep={4} totalSteps={4} />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Final Production</h2>
          <p className="text-zinc-400">Compile your clips into a seamless movie.</p>
        </div>

        <div className="glass-card p-8 rounded-2xl text-center space-y-8 min-h-[400px] flex flex-col justify-center items-center">
          
          {/* State 1: Ready to Generate */}
          {!isGenerating && !finalVideoUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Ready to compile 6 scenes</h3>
              <p className="text-zinc-500 max-w-md mx-auto">
                We'll stitch your generated clips together with smooth transitions and background ambience.
              </p>
              <button onClick={handleGenerateFull} className="btn-primary px-10 py-4 text-lg">
                Generate Full Movie
              </button>
            </motion.div>
          )}

          {/* State 2: Generating */}
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md space-y-6">
              <h3 className="text-xl font-semibold animate-pulse">Rendering Final Output...</h3>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-zinc-500 font-mono">{Math.round(progress)}% Complete</p>
            </motion.div>
          )}

          {/* State 3: Done */}
          {finalVideoUrl && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-8">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-medium">Rendering Complete!</span>
              </div>

              <div className="aspect-video w-full max-w-2xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                <video src={finalVideoUrl} controls className="w-full h-full" autoPlay />
              </div>

              <div className="flex justify-center gap-4">
                <a 
                  href={finalVideoUrl} 
                  download="my-minecraft-movie.mp4"
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Movie
                </a>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-start pt-8 border-t border-white/10">
          <button 
            onClick={() => setLocation("/wizard/animation")}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Animation
          </button>
        </div>
      </div>
    </Layout>
  );
}
