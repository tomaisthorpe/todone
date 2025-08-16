/**
 * Tests for context icons utility functions
 */

import { getContextIconComponent, contextIconMap, contextIconOptions } from '../context-icons';
import { Home } from 'lucide-react';

describe('getContextIconComponent', () => {
  it('should return the correct icon component for valid names', () => {
    const result = getContextIconComponent('Home');
    expect(result).toBe(Home);
  });

  it('should return the correct icon component for all mapped icons', () => {
    // Test all icons in the map
    Object.keys(contextIconMap).forEach(iconName => {
      const result = getContextIconComponent(iconName);
      expect(result).toBe(contextIconMap[iconName]);
             expect(typeof result).toBe('object'); // Should be a React component (object in test environment)
    });
  });

  it('should return Home icon as fallback for unknown icon names', () => {
    const result = getContextIconComponent('UnknownIcon');
    expect(result).toBe(Home);
  });

  it('should return Home icon as fallback for empty string', () => {
    const result = getContextIconComponent('');
    expect(result).toBe(Home);
  });

  it('should return Home icon as fallback for null/undefined inputs', () => {
    // TypeScript prevents this, but testing runtime behavior
    const result1 = getContextIconComponent(null as any);
    const result2 = getContextIconComponent(undefined as any);
    expect(result1).toBe(Home);
    expect(result2).toBe(Home);
  });

  it('should be case sensitive', () => {
    // Test that function is case sensitive
    const result1 = getContextIconComponent('home'); // lowercase
    const result2 = getContextIconComponent('HOME'); // uppercase
    const result3 = getContextIconComponent('Home'); // correct case
    
    expect(result1).toBe(Home); // Fallback
    expect(result2).toBe(Home); // Fallback
    expect(result3).toBe(Home); // Actual Home icon
  });

  it('should handle whitespace and special characters as fallback', () => {
    const testCases = [
      '  Home  ', // with spaces
      'Home-Icon', // with dash
      'Home_Icon', // with underscore
      'Home.Icon', // with dot
      'Home Icon', // with space
    ];

    testCases.forEach(testCase => {
      const result = getContextIconComponent(testCase);
      expect(result).toBe(Home); // All should fallback to Home
    });
  });

  it('should work with all food category icons', () => {
    const foodIcons = [
      'Pizza', 'UtensilsCrossed', 'ChefHat', 'Wine', 'Beer', 
      'Grape', 'Salad', 'CookingPot', 'Croissant', 'IceCreamCone', 
      'Cake', 'Sandwich', 'Soup'
    ];

    foodIcons.forEach(iconName => {
      const result = getContextIconComponent(iconName);
      expect(result).toBe(contextIconMap[iconName]);
      expect(result).not.toBe(Home); // Should not be fallback
    });
  });

  it('should work with all finance category icons', () => {
    const financeIcons = [
      'Wallet', 'Coins', 'PiggyBank', 'CreditCard', 'Banknote', 
      'TrendingUp', 'Calculator', 'Receipt'
    ];

    financeIcons.forEach(iconName => {
      const result = getContextIconComponent(iconName);
      expect(result).toBe(contextIconMap[iconName]);
      expect(result).not.toBe(Home); // Should not be fallback
    });
  });

  it('should work with all nature/plant category icons', () => {
    const natureIcons = [
      'Leaf', 'TreePine', 'Sprout', 'Flower', 'TreeDeciduous', 
      'Flower2', 'LeafyGreen', 'Trees'
    ];

    natureIcons.forEach(iconName => {
      const result = getContextIconComponent(iconName);
      expect(result).toBe(contextIconMap[iconName]);
      expect(result).not.toBe(Home); // Should not be fallback
    });
  });

  it('should work with science/lab category icons', () => {
    const scienceIcons = ['FlaskConical', 'TestTube', 'Beaker'];

    scienceIcons.forEach(iconName => {
      const result = getContextIconComponent(iconName);
      expect(result).toBe(contextIconMap[iconName]);
      expect(result).not.toBe(Home); // Should not be fallback
    });
  });

  it('should work with legacy icons', () => {
    const legacyIcons = ['Car', 'Briefcase', 'Inbox'];

    legacyIcons.forEach(iconName => {
      const result = getContextIconComponent(iconName);
      expect(result).toBe(contextIconMap[iconName]);
      expect(result).not.toBe(Home); // Should not be fallback
    });
  });
});

describe('contextIconOptions', () => {
  it('should be a readonly array', () => {
    expect(Array.isArray(contextIconOptions)).toBe(true);
    expect(contextIconOptions.length).toBeGreaterThan(0);
  });

  it('should have correct structure for each option', () => {
    contextIconOptions.forEach(option => {
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('icon');
      expect(option).toHaveProperty('label');
      
      expect(typeof option.value).toBe('string');
             expect(typeof option.icon).toBe('object'); // React component (object in test environment)
      expect(typeof option.label).toBe('string');
      
      expect(option.value.length).toBeGreaterThan(0);
      expect(option.label.length).toBeGreaterThan(0);
    });
  });

  it('should have icons that exist in contextIconMap', () => {
    contextIconOptions.forEach(option => {
      expect(contextIconMap[option.value]).toBeDefined();
      expect(contextIconMap[option.value]).toBe(option.icon);
    });
  });

  it('should include essential icons', () => {
    const essentialIcons = ['Home', 'Inbox', 'Code', 'Coffee', 'Building'];
    
    essentialIcons.forEach(iconName => {
      const found = contextIconOptions.find(option => option.value === iconName);
      expect(found).toBeDefined();
      expect(found!.icon).toBe(contextIconMap[iconName]);
    });
  });

  it('should have unique values', () => {
    const values = contextIconOptions.map(option => option.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

    it('should have meaningful labels', () => {
    contextIconOptions.forEach(option => {
      // Labels should not contain technical names like "UtensilsCrossed"
      expect(option.label).not.toContain('Crossed');
      expect(option.label).not.toContain('Conical');
      
      // Labels should be descriptive
      expect(option.label.length).toBeGreaterThan(2);
      
      // Labels should be present and meaningful
      expect(option.label).toBeDefined();
      expect(option.label.trim().length).toBeGreaterThan(0);
    });
  });

  it('should be ordered logically with Home and Inbox first', () => {
    expect(contextIconOptions[0].value).toBe('Home');
    expect(contextIconOptions[1].value).toBe('Inbox');
  });

  it('should group related icons together', () => {
    const values = contextIconOptions.map(option => option.value);
    
    // Find food-related icons
    const foodIcons = ['Pizza', 'UtensilsCrossed', 'ChefHat', 'Wine', 'Beer'];
    const foodIndices = foodIcons.map(icon => values.indexOf(icon)).filter(index => index !== -1);
    
    // Food icons should be relatively close to each other
    if (foodIndices.length > 1) {
      const minIndex = Math.min(...foodIndices);
      const maxIndex = Math.max(...foodIndices);
      // They should be within a reasonable range of each other
      expect(maxIndex - minIndex).toBeLessThan(15);
    }
  });
});

describe('contextIconMap', () => {
  it('should be an object with string keys and function values', () => {
    expect(typeof contextIconMap).toBe('object');
    expect(contextIconMap).not.toBeNull();
    
    Object.entries(contextIconMap).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
             expect(typeof value).toBe('object'); // React component (object in test environment)
      expect(key.length).toBeGreaterThan(0);
    });
  });

  it('should include all required icon categories', () => {
    const requiredCategories = {
      basic: ['Home', 'Code', 'Coffee', 'Building'],
      food: ['Pizza', 'ChefHat', 'Wine'],
      finance: ['Wallet', 'Coins', 'Calculator'],
      nature: ['Leaf', 'Flower', 'Trees'],
      science: ['FlaskConical', 'TestTube', 'Beaker'],
      legacy: ['Car', 'Briefcase', 'Inbox']
    };

    Object.values(requiredCategories).flat().forEach(iconName => {
      expect(contextIconMap[iconName]).toBeDefined();
             expect(typeof contextIconMap[iconName]).toBe('object'); // React component (object in test environment)
    });
  });

  it('should have Home icon available', () => {
    expect(contextIconMap.Home).toBeDefined();
    expect(contextIconMap.Home).toBe(Home);
  });

  it('should contain all icons referenced in contextIconOptions', () => {
    contextIconOptions.forEach(option => {
      expect(contextIconMap[option.value]).toBeDefined();
      expect(contextIconMap[option.value]).toBe(option.icon);
    });
  });
});