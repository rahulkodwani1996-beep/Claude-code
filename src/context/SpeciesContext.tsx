import React, { createContext, useContext, useState, useCallback } from 'react';
import { Species } from '../types';

interface SpeciesContextValue {
  species: Species;
  setSpecies: (s: Species) => void;
  cycleSpecies: () => void;
}

const SpeciesContext = createContext<SpeciesContextValue>({
  species: 'both',
  setSpecies: () => {},
  cycleSpecies: () => {},
});

export const SpeciesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [species, setSpeciesState] = useState<Species>('both');

  const setSpecies = useCallback((s: Species) => {
    setSpeciesState(s);
  }, []);

  const cycleSpecies = useCallback(() => {
    setSpeciesState(prev => {
      if (prev === 'both') return 'dog';
      if (prev === 'dog') return 'cat';
      return 'both';
    });
  }, []);

  return (
    <SpeciesContext.Provider value={{ species, setSpecies, cycleSpecies }}>
      {children}
    </SpeciesContext.Provider>
  );
};

export const useSpecies = () => useContext(SpeciesContext);

export const matchesSpeciesFilter = (contentTag: Species, filter: Species): boolean => {
  if (filter === 'both') return true;
  return contentTag === filter || contentTag === 'both';
};
