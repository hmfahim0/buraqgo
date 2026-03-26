import React from 'react';
import { motion } from 'motion/react';

export const About = () => {
  return (
    <div className="pb-16">
      <div className="max-w-7xl mx-auto px-4 py-24 space-y-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12 text-center"
        >
          <div className="inline-block px-4 py-1 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-widest uppercase mb-4">
            Our Philosophy
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight">Beyond the Model</h2>
          <p className="text-2xl text-zinc-600 leading-relaxed max-w-4xl mx-auto font-light italic">
            "BuraqGo was founded with a singular passion: to bring the world's most sought-after collectibles to Bangladesh, inspiring collectors with engineering excellence and artistic vision."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Our Mission</h3>
              <div className="h-1 w-20 bg-primary" />
            </div>
            <p className="text-zinc-600 text-lg leading-relaxed font-light">
              To provide collectors in Bangladesh with authentic, high-quality models that inspire 
              and elevate their collections. We believe every model tells a story of engineering 
              excellence and artistic vision.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Quality Guaranteed</h3>
              <div className="h-1 w-20 bg-primary" />
            </div>
            <p className="text-zinc-600 text-lg leading-relaxed font-light">
              Every item in our inventory is carefully inspected to ensure it meets our rigorous 
              standards for quality and authenticity. We partner directly with leading manufacturers 
              to bring you the best.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="py-24 border-t border-zinc-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6 group">
              <div className="text-6xl font-black text-zinc-100 group-hover:text-primary/10 transition-colors duration-500">01</div>
              <h4 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Authenticity</h4>
              <p className="text-zinc-500 leading-relaxed font-light">Direct partnerships with global brands ensure 100% genuine products and exclusive releases.</p>
            </div>
            <div className="space-y-6 group">
              <div className="text-6xl font-black text-zinc-100 group-hover:text-primary/10 transition-colors duration-500">02</div>
              <h4 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Precision</h4>
              <p className="text-zinc-500 leading-relaxed font-light">We focus on models that push the boundaries of scale and detail, curated for the discerning collector.</p>
            </div>
            <div className="space-y-6 group">
              <div className="text-6xl font-black text-zinc-100 group-hover:text-primary/10 transition-colors duration-500">03</div>
              <h4 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Community</h4>
              <p className="text-zinc-500 leading-relaxed font-light">Building a home for serious collectors in the heart of Bangladesh, fostering a culture of appreciation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
