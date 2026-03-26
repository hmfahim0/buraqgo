import React from 'react';
import { motion } from 'motion/react';
import { Shield, Award, History, Target } from 'lucide-react';

export const Heritage = () => {
  return (
    <div className="pb-16">
      {/* Heritage Hero */}
      <section className="relative h-[600px] flex items-center bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=2000" 
            alt="Heritage Background"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-zinc-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-1 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-widest uppercase mb-4">
              Est. 2012
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase">
              Buraq <span className="text-primary">Heritage</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
              A legacy of precision engineering and timeless craftsmanship. We preserve history in scale.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8 space-y-48"
      >
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight uppercase">The Buraq Story</h2>
              <div className="h-1.5 w-24 bg-primary" />
              <p className="text-zinc-600 text-xl font-light leading-relaxed">
                Founded on the principles of precision engineering, BuraqGo has been the standard for collectors who demand more than just a model. Every curve, every bolt, and every finish is a testament to our dedication to the craft.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-2">
                <p className="text-5xl font-black text-primary tracking-tighter">2012</p>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Studio Founded</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-black text-primary tracking-tighter">500+</p>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Unique Designs</p>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            <img 
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" 
              alt="Heritage Workshop" 
              className="relative w-full h-[600px] object-cover rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div 
            whileHover={{ y: -10 }}
            className="space-y-6 p-12 bg-white border border-zinc-100 rounded-3xl shadow-xl shadow-zinc-200/50"
          >
            <div className="bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl text-primary">
              <Shield size={32} />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Quality</h3>
            <p className="text-zinc-500 font-light leading-relaxed">
              Every piece undergoes a rigorous inspection process to ensure it meets our standard of excellence.
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="space-y-6 p-12 bg-white border border-zinc-100 rounded-3xl shadow-xl shadow-zinc-200/50"
          >
            <div className="bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl text-primary">
              <Award size={32} />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Authenticity</h3>
            <p className="text-zinc-500 font-light leading-relaxed">
              We work with original blueprints to recreate every detail with absolute fidelity.
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="space-y-6 p-12 bg-white border border-zinc-100 rounded-3xl shadow-xl shadow-zinc-200/50"
          >
            <div className="bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl text-primary">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Precision</h3>
            <p className="text-zinc-500 font-light leading-relaxed">
              Our models are engineered with moving parts that reflect real-world mechanics.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="space-y-24 py-24 border-t border-zinc-100">
          <div className="text-center space-y-4">
            <div className="text-primary font-bold tracking-widest uppercase text-sm">The Journey</div>
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-tight">Our Evolution</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { year: '2012', title: 'The First Prototype', desc: 'The BuraqGo studio was founded with a mission to build precise models.' },
              { year: '2015', title: 'Tactical Expansion', desc: 'Launched our first tactical heritage series, bringing precision to historical gear.' },
              { year: '2019', title: 'Global Recognition', desc: 'BuraqGo models became sought-after pieces in international collections.' },
              { year: '2023', title: 'The Next Generation', desc: 'Introducing modular display systems for the modern collector.' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-6 group">
                <div className="text-5xl font-black text-zinc-100 group-hover:text-primary/20 transition-colors duration-500 tracking-tighter">{item.year}</div>
                <div className="space-y-3">
                  <h4 className="text-lg font-black text-zinc-900 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-zinc-500 text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
