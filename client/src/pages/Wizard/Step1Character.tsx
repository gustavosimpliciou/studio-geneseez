import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WizardProgress } from "@/components/WizardProgress";
import { ImageGrid } from "@/components/ImageGrid";
import { useProject } from "@/hooks/use-project";
import { Loader2, Wand2, ArrowRight, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const N8N_WEBHOOK_URL = "https://studiogeneseez.app.n8n.cloud/webhook-test/1905b777-c8f6-46db-8a3d-c67dec7bb0b8";

export default function Step1Character() {
  const [, setLocation] = useLocation();
  const { project, updateProject } = useProject();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState(project?.characterRef?.prompt || "");
  const [generatedImages, setGeneratedImages] = useState<string[]>(project?.characterRef?.images || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 3 - uploadedImages.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result as string].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    try {
      // Create a clean payload object
      const payload = {
        prompt: prompt.trim(),
        images: uploadedImages, // Array of base64 strings
        timestamp: new Date().toISOString(),
        project_id: project?.id
      };

      console.log("Sending payload to n8n:", { ...payload, images: `${payload.images.length} images` });

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: 'cors',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook failed: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      
      // Artificial 5 second delay as requested
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Expecting data.images or data.image from n8n
      let newImages: string[] = [];
      if (Array.isArray(data)) {
        // n8n might return an array of items directly
        newImages = data.map(item => item.images || item.image).filter(Boolean).flat();
      } else {
        newImages = data.images || (data.image ? [data.image] : []);
      }
      
      if (newImages.length > 0) {
        setGeneratedImages(newImages);
        toast({
          title: "Characters Generated",
          description: "Select your favorite style to proceed.",
        });
      } else {
        console.warn("No images in response:", data);
        throw new Error("No images returned from n8n");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate character. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
      
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <Wand2 className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Generating Your Character</h3>
                <p className="text-zinc-400">Our AI is crafting your Minecraft masterpiece...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Design Your Character</h2>
          <p className="text-zinc-400">Describe your protagonist. Our AI will generate unique Minecraft-style variations.</p>
        </div>

        {/* Input Section */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. A brave knight with diamond armor and a flowing red cape standing in a snowy tundra..."
              className="input-field min-h-[120px] resize-none text-lg pr-12"
            />
            
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadedImages.length >= 3}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={uploadedImages.length >= 3 ? "Maximum 3 images" : "Upload reference images (max 3)"}
              >
                <Upload className="w-5 h-5" />
              </button>

              {uploadedImages.map((img, index) => (
                <div key={index} className="relative w-12 h-12 rounded-lg overflow-hidden border border-primary/50">
                  <img src={img} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 right-4 text-xs text-zinc-500">
              {prompt.length}/500
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              className="btn-primary flex items-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Generate Character
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
