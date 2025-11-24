import React from "react";

const BioHacksView: React.FC = () => {
  const sensoryRecipes = [
    {
      title: "🍋 The Lime Drag",
      description:
        "A sharp, sour taste to jolt focus and provide a sensory shock, ideal for breaking through mental fog or overwhelming moments.",
      benefits: ["Rapid Focus", "Sensory Shock", "Mental Clarity"],
      ingredients: ["Fresh Lime", "Salt (optional)"],
      instructions: [
        "Cut a fresh lime into wedges.",
        "Take a deep breath.",
        "Suck on a lime wedge, allowing the intense sourness to flood your senses.",
        "Optionally, sprinkle a little salt on the lime for an extra jolt.",
        "Focus on the sensation, letting it reset your mental state.",
      ],
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
    },
    {
      title: "🕶️ The Shield",
      description:
        "Utilize deep pressure and visual dampening to create a personal sensory shield, perfect for reducing overwhelm in chaotic environments.",
      benefits: ["Overwhelm Reduction", "Sensory Dampening", "Calm"],
      ingredients: [
        "Weighted Blanket or Heavy Object",
        "Eye Mask or Dark Glasses",
        "Noise-Cancelling Headphones (optional)",
      ],
      instructions: [
        "Find a quiet space if possible.",
        "Apply a weighted blanket or heavy object across your lap or chest for deep pressure input.",
        "Put on an eye mask or dark glasses to reduce visual stimuli.",
        "Optionally, wear noise-cancelling headphones for auditory dampening.",
        "Focus on your breath and the feeling of pressure, creating a personal calm zone.",
      ],
      color: "bg-blue-500/20 text-blue-300 border-blue-500",
    },
    {
      title: "🧱 The Heavy Work",
      description:
        "Engage in strenuous physical activity to channel anxiety and promote grounding, effective for emotional regulation and re-centering.",
      benefits: ["Grounding", "Anxiety Relief", "Emotional Regulation"],
      ingredients: ["Heavy Backpack or Resistance Bands", "Physical Space"],
      instructions: [
        "Fill a backpack with heavy items (books, water bottles) or grab resistance bands.",
        "Perform pushing, pulling, or lifting movements against the resistance for 5-10 minutes.",
        "Focus on the physical exertion and the sensation of your muscles working.",
        "Alternatively, do wall push-ups, carry heavy bags, or engage in other heavy work activities.",
        "Notice how your body feels grounded and your mind becomes clearer.",
      ],
      color: "bg-red-500/20 text-red-300 border-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-text-main p-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary-400 mb-2">
          💊 The Apothecary
        </h1>
        <p className="text-text-muted text-lg">
          Bio-Hacks for Neurodivergent Regulation
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Sensory recipes for focus, calm, and grounding.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {sensoryRecipes.map((recipe, index) => (
          <div
            key={index}
            className={`bg-card-dark rounded-xl shadow-lg p-6 border ${recipe.color}`}
          >
            <h2 className="text-2xl font-bold mb-3">{recipe.title}</h2>
            <p className="text-text-muted mb-4">{recipe.description}</p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Benefits:</h3>
              <ul className="list-disc list-inside text-sm text-gray-400">
                {recipe.benefits.map((benefit, bIndex) => (
                  <li key={bIndex}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside text-sm text-gray-400">
                {recipe.ingredients.map((ingredient, iIndex) => (
                  <li key={iIndex}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
                {recipe.instructions.map((instruction, inIndex) => (
                  <li key={inIndex}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BioHacksView;
