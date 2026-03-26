import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ShieldCheck, HelpCircle, Mail } from 'lucide-react';

export const Returns = () => {
  return (
    <div className="pb-24">
      {/* Returns Hero */}
      <section className="relative h-[30vh] flex items-center overflow-hidden bg-[#7c845c] mb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Buraqgo_bg.png" 
            alt="Returns Hero"
            className="w-full h-full object-cover opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-4">
            <div className="h-1 w-12 bg-primary" />
            <h1 className="text-4xl font-display font-black tracking-tight text-white uppercase">Returns & Refunds</h1>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="space-y-4">
            <p className="text-gray-500 text-lg">
              We stand behind the quality of our precision models. If you're not satisfied, we're here to help.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <RotateCcw size={24} />
              <h3 className="text-xl font-bold">30-Day Return Policy</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              You have 30 days from the date of delivery to return your model. The item must be in its original packaging and in the same condition as when you received it.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <ShieldCheck size={24} />
              <h3 className="text-xl font-bold">Quality Guarantee</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              If your model arrives damaged or with a manufacturing defect, we will provide a full refund or a replacement at no additional cost to you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <HelpCircle size={24} />
              <h3 className="text-xl font-bold">How to Start a Return</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To initiate a return, please contact our support team with your order number and photos of the item. We will provide you with a return shipping label.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Mail size={24} />
              <h3 className="text-xl font-bold">Refund Process</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Once we receive and inspect your return, we will process your refund within 5-7 business days. The refund will be issued to your original payment method.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg space-y-4">
          <h3 className="font-bold text-lg">Non-Returnable Items</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Limited edition models with broken seals</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Customized or engraved items</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Items purchased during clearance sales</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  </div>
  );
};
