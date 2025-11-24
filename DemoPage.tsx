import React from "react";
import { motion } from "framer-motion";
import GardenView from "./components/GardenView";
import { useEffect, useState } from "react";
import MarkdownStory from "./components/MarkdownStory";

const DemoPage = () => {
  const [story, setStory] = useState("");
  const [memories, setMemories] = useState<string[]>([
    "First family picnic in the Sprout Garden!",
    "Grandma's wisdom about nurturing thoughts.",
  ]);
  const [newMemoryInput, setNewMemoryInput] = useState("");

  const addMemory = () => {
    if (newMemoryInput.trim()) {
      setMemories([...memories, newMemoryInput.trim()]);
      setNewMemoryInput("");
    }
  };

  useEffect(() => {
    // Dynamically load THE_ORIGIN_STORY.md for live updates
    fetch(window.location.origin + "/THE_ORIGIN_STORY.md")
      .then((res) => res.text())
      .then(setStory);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex flex-col items-center justify-center p-8"
    >
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="text-5xl font-extrabold text-green-700 drop-shadow-lg mb-2 animate-bounce">
          🌱 Wonky Sprout OS Demo
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-700 italic"
        >
          A magical garden for your family, memories, and story
        </motion.p>
      </motion.header>
      <SectionWithAnimation delay={0.6}>
        <h2 className="text-3xl font-bold text-blue-600 mb-4">
          The Origin Story
        </h2>
        <div className="prose prose-lg text-gray-800">
          <MarkdownStory content={story || "Loading story..."} />
        </div>
      </SectionWithAnimation>
      <SectionWithAnimation delay={0.8}>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Garden Visualization
        </h2>
        <GardenView />
      </SectionWithAnimation>
      <SectionWithAnimation delay={1.0}>
        <h2 className="text-2xl font-bold text-purple-600 mb-2">
          Family Memorials & Highlights
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Add a cherished memory..."
            className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
            value={newMemoryInput}
            onChange={(e) => setNewMemoryInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addMemory();
              }
            }}
          />
          <button
            onClick={addMemory}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            Add Memory
          </button>
        </div>
        <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
          {memories.map((memory, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {memory}
            </motion.li>
          ))}
        </ul>
      </SectionWithAnimation>
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-12 text-center text-gray-500"
      >
        <p>Made with 💚 for Mom and family</p>
      </motion.footer>
    </motion.div>
  );
};

const SectionWithAnimation: React.FC<{
  children: React.ReactNode;
  delay: number;
}> = ({ children, delay }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-6 mb-8"
  >
    {children}
  </motion.section>
);
export default DemoPage;
