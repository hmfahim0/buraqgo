import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="pb-24">
      {/* Privacy Hero */}
      <section className="relative h-[30vh] flex items-center overflow-hidden bg-[#7c845c] mb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Buraqgo_bg.png" 
            alt="Privacy Hero"
            className="w-full h-full object-cover opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-4">
            <div className="h-1 w-12 bg-primary" />
            <h1 className="text-4xl font-display font-black tracking-tight text-white uppercase">Privacy Policy</h1>
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
              Your privacy is as important to us as the precision of our models.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <ShieldCheck size={24} />
              <h3 className="text-xl font-bold">Data Protection</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We use industry-standard encryption to protect your personal information. Your data is stored securely and accessed only by authorized personnel.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Lock size={24} />
              <h3 className="text-xl font-bold">Secure Payments</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We do not store your credit card information. All payments are processed through secure, PCI-compliant payment gateways.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Eye size={24} />
              <h3 className="text-xl font-bold">Information We Collect</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We collect information necessary to process your orders and provide a personalized experience, such as your name, email, and shipping address.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <FileText size={24} />
              <h3 className="text-xl font-bold">Third-Party Sharing</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information. We only share data with trusted partners necessary for order fulfillment and delivery.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg space-y-4">
          <h3 className="font-bold text-lg">Your Rights</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Right to access your personal data</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Right to correct or delete your information</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Right to opt-out of marketing communications</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  </div>
  );
};
