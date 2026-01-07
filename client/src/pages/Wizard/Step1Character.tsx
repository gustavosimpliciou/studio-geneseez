import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WizardProgress } from "@/components/WizardProgress";
import { ImageGrid } from "@/components/ImageGrid";
import { useProject } from "@/hooks/use-project";
import { Loader2, Wand2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Step1Character() {
  const [, setLocation] = useLocation();
  const { project, generateCharacter, updateProject } = useProject();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState(project?.characterRef?.prompt || "");
  const [generatedImages, setGeneratedImages] = useState<string[]>(project?.characterRef?.images || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt) return;
    
    generateCharacter.mutate(prompt, {
      onSuccess: (data) => {
        setGeneratedImages(data.images);
        toast({
          title: "Characters Generated",
          description: "Select your favorite style to proceed.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to generate character. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleNext = () => {
    if (!selectedImage) {
      toast({
        title: "Selection Required",
        description: "Please select a character image to continue.",
        variant: "destructive",
      });
      return;
    }

    updateProject.mutate({
      characterRef: {
        prompt,
        images: generatedImages,
      }
    }, {
      onSuccess: () => {
        setLocation("/wizard/storyboard");
      }
    });
  };

  return (
    <Layout>
      <WizardProgress currentStep={1} totalSteps={4} />
      
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Design Your Character</h2>
          <p className="text-zinc-400">Describe your protagonist. Our AI will generate 8 unique Minecraft-style variations.</p>
        </div>

        {/* Input Section */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. A brave knight with diamond armor and a flowing red cape standing in a snowy tundra..."
              className="input-field min-h-[120px] resize-none text-lg"
            />
            <div className="absolute bottom-4 right-4 text-xs text-zinc-500">
              {prompt.length}/500
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!prompt || generateCharacter.isPending}
              className="btn-primary flex items-center gap-2"
            >
              {generateCharacter.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Character
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {generatedImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Select a Style</h3>
              <span className="text-sm text-zinc-500">Click to select</span>
            </div>
            
            <ImageGrid 
              images={generatedImages}
              selectedImage={selectedImage}
              onSelect={setSelectedImage}
            />

            <div className="flex justify-end pt-8">
              <button
                onClick={handleNext}
                disabled={!selectedImage || updateProject.isPending}
                className="btn-primary flex items-center gap-2 px-8"
              >
                Next: Storyboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
