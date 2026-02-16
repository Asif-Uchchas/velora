"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatters";

interface WhatsAppChatProps {
  productName: string;
  productPrice: number;
  productImage?: string;
  productSlug: string;
  phoneNumber: string;
  businessName?: string;
}

export function WhatsAppChatButton({
  productName,
  productPrice,
  productImage,
  productSlug,
  phoneNumber,
  businessName = "Velora Store",
}: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const formatWhatsAppNumber = (phone: string) => {
    // Remove all non-numeric characters
    return phone.replace(/\D/g, "");
  };

  const generateWhatsAppLink = () => {
    const formattedPhone = formatWhatsAppNumber(phoneNumber);
    const baseMessage = message || `Hi! I'm interested in ${productName}. Can you provide more information?`;
    const encodedMessage = encodeURIComponent(baseMessage);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  const quickMessages = [
    "Is this still available?",
    "Can I get a discount?",
    "Do you have other colors?",
    "What's the delivery time?",
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#25D366] text-white p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{businessName}</h3>
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    Typically replies instantly
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Preview */}
              <div className="p-4 bg-muted/30 border-b">
                <div className="flex items-center gap-3">
                  {productImage && (
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{productName}</p>
                    <p className="text-primary font-bold">{formatPrice(productPrice)}</p>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                {/* Business Message */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm">
                      Hi there! 👋 How can we help you with {productName}?
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Just now
                    </span>
                  </div>
                </motion.div>

                {/* Quick Messages */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Quick Questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickMessages.map((msg, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setMessage(msg)}
                        className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                      >
                        {msg}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-muted/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 rounded-xl border bg-white dark:bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) {
                        window.open(generateWhatsAppLink(), "_blank");
                      }
                    }}
                  />
                  <motion.a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#25D366] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </motion.a>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  Secure conversation via WhatsApp Business
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Simple WhatsApp Button for non-product pages
interface SimpleWhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

export function SimpleWhatsAppButton({
  phoneNumber,
  message = "Hi! I have a question about your products.",
  className = "",
}: SimpleWhatsAppButtonProps) {
  const formatWhatsAppNumber = (phone: string) => {
    return phone.replace(/\D/g, "");
  };

  const whatsappLink = `https://wa.me/${formatWhatsAppNumber(phoneNumber)}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl font-medium ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <MessageCircle className="w-5 h-5" />
      Chat on WhatsApp
    </motion.a>
  );
}
