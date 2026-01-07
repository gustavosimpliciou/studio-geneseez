import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ImageGridProps {
  images: string[];
  selectedImage: string | null;
  onSelect: (img: string) => void;
}

export function ImageGrid({ images, selectedImage, onSelect }: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`
            relative aspect-square rounded-xl overflow-hidden cursor-pointer group
            border-2 transition-all duration-200
            ${selectedImage === img ? "border-white ring-2 ring-white/20 shadow-xl scale-[1.02]" : "border-transparent hover:border-white/30"}
          `}
          onClick={() => onSelect(img)}
        >
          <img 
            src={img} 
            alt={`Generated variation ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {selectedImage === img && (
            <div className="absolute top-2 right-2 text-white bg-black/50 backdrop-blur-md rounded-full p-1">
              <CheckCircle2 className="w-5 h-5 fill-white text-black" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
