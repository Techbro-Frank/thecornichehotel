"use client";

import { motion } from "framer-motion";

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const placeholders = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  label: `@thecornichehotel`,
}));

export default function InstagramPlaceholder() {
  return (
    <section className="section-padding bg-beige" id="instagram">
      <div className="container-luxury">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <InstagramIcon size={22} className="text-gold" />
            <p className="label-uppercase">Follow Us on Instagram</p>
          </div>
          <a
            href="https://instagram.com/thecornichehotel"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-dark hover:text-gold transition-colors"
            style={{ transitionDuration: "var(--duration-normal)" }}
          >
            @thecornichehotel
          </a>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {placeholders.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="aspect-square bg-beige-light relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-beige-light to-border" />
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-colors duration-500 flex items-center justify-center">
                <InstagramIcon
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
