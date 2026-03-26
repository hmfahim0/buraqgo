import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, Facebook } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="pb-16">
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-widest uppercase mb-4">
                Support
              </div>
              <h2 className="text-4xl font-black text-zinc-900 tracking-tight uppercase">Connect With Us</h2>
              <p className="text-zinc-600 text-lg font-light leading-relaxed">
                Experience personalized assistance from our collection experts. We are committed to providing 
                the highest level of service to our community.
              </p>
            </div>

            <div className="space-y-10">
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-6 group cursor-pointer"
              >
                <div className="bg-zinc-900 p-4 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Phone Support</h3>
                  <p className="text-xl font-black text-zinc-900">01312322447</p>
                  <p className="text-sm text-zinc-500 font-light">Available 10 AM - 8 PM Daily</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-6 group cursor-pointer"
              >
                <div className="bg-zinc-900 p-4 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Email Inquiry</h3>
                  <p className="text-xl font-black text-zinc-900">support@buraqgo.com</p>
                  <p className="text-sm text-zinc-500 font-light">24/7 Digital Concierge</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-6 group cursor-pointer"
              >
                <div className="bg-zinc-900 p-4 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Facebook size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Social Community</h3>
                  <a href="https://facebook.com/BuraqGo" className="text-xl font-black text-zinc-900 hover:text-primary transition-colors">facebook.com/BuraqGo</a>
                  <p className="text-sm text-zinc-500 font-light">Official Buraq Community</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-zinc-300" 
                      placeholder="Enter your name" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-zinc-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-zinc-300" 
                      placeholder="email@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Your Message</label>
                  <textarea 
                    className="w-full bg-zinc-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none h-48 transition-all resize-none placeholder:text-zinc-300" 
                    placeholder="How can we assist you today?"
                  ></textarea>
                </div>
                <button 
                  type="button" 
                  className="w-full bg-zinc-900 text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-lg shadow-zinc-900/20"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
