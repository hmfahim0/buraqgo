import React from 'react';
import { motion } from 'motion/react';
import { Truck, Clock, ShieldCheck, Globe } from 'lucide-react';

export const ShippingInfo = () => {
  return (
    <div className="pb-24">
      {/* Shipping Hero */}
      <section className="relative h-[30vh] flex items-center overflow-hidden bg-[#7c845c] mb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Buraqgo_bg.png" 
            alt="Shipping Hero"
            className="w-full h-full object-cover opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-4">
            <div className="h-1 w-12 bg-primary" />
            <h1 className="text-4xl font-display font-black tracking-tight text-white uppercase">Shipping Information</h1>
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
              We take the utmost care in ensuring your precision models arrive in perfect condition.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Truck size={24} />
              <h3 className="text-xl font-bold">Delivery Methods</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We offer standard and express shipping across Bangladesh. For international collectors, we partner with premium couriers to ensure safe transit of your models.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Clock size={24} />
              <h3 className="text-xl font-bold">Processing Time</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Orders are typically processed within 24-48 hours. Once shipped, you will receive a tracking number to monitor your delivery.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <ShieldCheck size={24} />
              <h3 className="text-xl font-bold">Secure Packaging</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Every model is double-boxed and cushioned with high-density foam to prevent any movement or impact damage during transit.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Globe size={24} />
              <h3 className="text-xl font-bold">International Shipping</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We ship to over 50 countries. Please note that international orders may be subject to local customs duties and taxes.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg space-y-4">
          <h3 className="font-bold text-lg">Estimated Delivery Times</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between border-b border-gray-200 pb-2">
              <span>Dhaka City</span>
              <span className="font-bold text-black">1-2 Business Days</span>
            </li>
            <li className="flex justify-between border-b border-gray-200 pb-2">
              <span>Outside Dhaka</span>
              <span className="font-bold text-black">3-5 Business Days</span>
            </li>
            <li className="flex justify-between">
              <span>International</span>
              <span className="font-bold text-black">7-14 Business Days</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  </div>
  );
};
