import { useEffect } from 'react';
import { useNeuroPrefs } from '@contexts/NeurodivergentPreferencesContext';

export const useApplyNeuroPrefs = () => {
  const { prefs } = useNeuroPrefs();

  useEffect(() => {
    const root = document.documentElement || document.body;

    const classes: Record<string, boolean> = {
      'reduced-motion': prefs.reduceAnimations,
      'simplified-ui': prefs.simplifiedUi,
      'larger-text': prefs.largerText,
      'micro-steps-mode': prefs.microStepsMode,
    };

    Object.keys(classes).forEach((className) => {
      const should = classes[className];
      if (should) root.classList.add(className);
      else root.classList.remove(className);
    });

    return () => {
      Object.keys(classes).forEach((className) => root.classList.remove(className));
    };
  }, [prefs]);
};

export default useApplyNeuroPrefs;