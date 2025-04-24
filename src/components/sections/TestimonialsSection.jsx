import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-2 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
            Testimonials
          </Badge>
          <div className="space-y-2 flex flex-col items-center text-center  ">
            <h2 className="text-5xl md:text-[80px] font-medium text-black leading-tight tracking-tight md:leading-[1.35] -tracking-[0.02em] mb-5 max-w-4xl">
              What our community says
            </h2>
            <p className="text-xl md:text-3xl text-[#3D3F3D] leading-[1.35] max-w-4xl">
              Join thousands of conscious consumers making better beauty choices
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-white border-2 border-gray-200 hover:border-black p-6 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <div className="flex items-center mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-amber-400 fill-amber-400"
                    />
                  ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "SkinEthic has completely changed how I shop for beauty
                products. Now I understand what I'm putting on my skin and can
                make choices aligned with my values."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mr-3">
                  {String.fromCharCode(65 + i)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">Happy User {i}</p>
                  <p className="text-sm text-gray-500">Conscious Consumer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
