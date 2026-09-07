import React from 'react';
import { motion } from 'motion/react';
export default function AdminTags() {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8"><h1 className="text-3xl font-black mb-4">Tags</h1><p className="text-slate-500">Manage blog tags. This module is pending implementation.</p></motion.div>;
}
