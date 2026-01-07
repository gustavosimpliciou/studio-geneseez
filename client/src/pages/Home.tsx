import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, PlayCircle, Layers } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useProject } from "@/hooks/use-project";

export default function Home() {
  const [, setLocation] = useLocation();
  const { createProject, project } = useProject();

  const handleStart = () => {
    createProject.mutate({ name: "Untitled Project", status: "draft" }, {
      onSuccess: () => {
        setLocation("/wizard/character");
      }
    });
  };

  const handleResume = () => {
    if (project?.status === "completed") {
      setLocation("/wizard/export");
    } else if (project?.storyboard) {
      setLocation("/wizard/animation");
    } else if (project?.characterRef) {
      setLocation("/wizard/storyboard");
    } else {
      setLocation("/wizard/character");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-white/80">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI-Powered Minecraft Video Creator</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Turn your ideas into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Minecraft Epics
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Create stunning animated stories in minutes. Generate characters, storyboard your plot, and let AI animate the rest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button 
              onClick={handleStart}
              disabled={createProject.isPending}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4 h-auto min-w-[200px] justify-center"
            >
              {createProject.isPending ? "Creating..." : "Start New Project"}
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {project && (
              <button 
                onClick={handleResume}
                className="btn-secondary flex items-center gap-2 text-lg px-8 py-4 h-auto min-w-[200px] justify-center"
              >
                Resume Project
                <PlayCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Feature Grid Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-500/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/30 rounded-full blur-[100px]" />
        </div>
      </div>
    </Layout>
  );
}
