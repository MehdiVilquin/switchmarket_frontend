import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Heart } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 " />,
      title: "Ethical\nProducts",
      description:
        "Discover beauty products that align with your values and ethical standards",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 " />,
      title: "Full\nTransparency",
      description:
        "Understand what's in your products with our detailed ingredient analysis",
    },
    {
      icon: <Heart className="h-8 w-8 " />,
      title: "Better\nChoices",
      description:
        "Make informed decisions for your skin health and world impact",
    },
  ];

  return (
    <section className="py-32 px-4 md:px-24 bg-[#FBF9F7]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
        <motion.div
          className="text-center flex flex-col items-center gap-5 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-[80px] font-medium text-black leading-tight tracking-tight md:leading-[1.35] -tracking-[0.02em]">
            Really clean & fair product
          </h2>
          <p className="text-xl md:text-3xl text-[#3D3F3D] leading-[1.35]">
            Explore the ingredients in your products and understand their
            benefits for your skin, ensuring they are clean and ethically
            sourced.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-white px-8 py-6 pb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-3xl font-bold text-black mb-3 leading-[1.35] whitespace-pre-line">
                {f.title}
              </h3>
              <p className="text-[#3D3F3D] text-base leading-[1.35]">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
