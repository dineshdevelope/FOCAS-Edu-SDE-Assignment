// src/hooks/useVisitTracking.js
import { useEffect } from 'react';

export const useVisitTracking = () => {
  useEffect(() => {
    const incrementVisits = () => {
      try {
        // Use localStorage instead of cookies to avoid dependencies
        const currentVisits = parseInt(localStorage.getItem('userVisits')) || 0;
        const newVisits = currentVisits + 1;
        localStorage.setItem('userVisits', newVisits.toString());
      } catch (error) {
        console.error('Error tracking visits:', error);
      }
    };

    incrementVisits();
  }, []);
};