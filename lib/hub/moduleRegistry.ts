/**
 * Module Registry
 * 
 * Central registry for all available modules (core, community, private)
 * Handles module discovery, installation, and updates
 */

import type { 
  ModuleRegistryEntry, 
  ModuleRegistry, 
  ModuleMetadata 
} from '@/lib/types/module';

class ModuleRegistryService {
  private registry: ModuleRegistry;

  constructor() {
    this.registry = {
      core: [],
      community: [],
      private: []
    };
  }

  /**
   * Initialize registry with core modules
   */
  async initialize(): Promise<void> {
    // Load core modules
    this.registry.core = [
      {
        metadata: {
          id: 'calendar',
          name: 'Calendar Module',
          description: 'Schedule coordination, events, reminders, and cross-platform sync',
          author: 'Tetrahedron Protocol',
          version: '1.0.0',
          license: 'CC-BY-4.0',
          category: 'productivity',
          tags: ['calendar', 'scheduling', 'events', 'coordination'],
          dependencies: [],
          installations: 0,
          rating: 5.0,
          lastUpdated: new Date(),
          icon: '📅'
        },
        manifestUrl: '/modules/calendar/manifest.json',
        verified: true,
        stats: {
          installations: 0,
          rating: 5.0,
          reviews: 0
        }
      },
      {
        metadata: {
          id: 'status',
          name: 'Status Module (Phenix Navigator)',
          description: 'Real-time availability, health, mood, and needs broadcasting',
          author: 'Tetrahedron Protocol',
          version: '1.0.0',
          license: 'CC-BY-4.0',
          category: 'communication',
          tags: ['status', 'presence', 'health', 'mood', 'availability'],
          dependencies: [],
          installations: 0,
          rating: 5.0,
          lastUpdated: new Date(),
          icon: '📊'
        },
        manifestUrl: '/modules/status/manifest.json',
        verified: true,
        stats: {
          installations: 0,
          rating: 5.0,
          reviews: 0
        }
      },
      {
        metadata: {
          id: 'parenting',
          name: 'Parenting Module',
          description: 'Co-parent communication, custody calendar, rule alignment, and transition protocols',
          author: 'Tetrahedron Protocol',
          version: '1.0.0',
          license: 'CC-BY-4.0',
          category: 'parenting',
          tags: ['parenting', 'co-parenting', 'custody', 'communication', 'divorce'],
          dependencies: ['calendar'],
          installations: 0,
          rating: 5.0,
          lastUpdated: new Date(),
          icon: '👨‍👩‍👧'
        },
        manifestUrl: '/modules/parenting/manifest.json',
        verified: true,
        stats: {
          installations: 0,
          rating: 5.0,
          reviews: 0
        }
      },
      {
        metadata: {
          id: 'kids',
          name: 'Kids Module',
          description: 'Age-appropriate support content for children (5-17) navigating family systems',
          author: 'Tetrahedron Protocol',
          version: '1.0.0',
          license: 'CC-BY-4.0',
          category: 'education',
          tags: ['kids', 'children', 'education', 'support', 'resilience'],
          dependencies: [],
          installations: 0,
          rating: 5.0,
          lastUpdated: new Date(),
          icon: '🌟'
        },
        manifestUrl: '/modules/kids/manifest.json',
        verified: true,
        stats: {
          installations: 0,
          rating: 5.0,
          reviews: 0
        }
      }
    ];
  }

  /**
   * Get all available modules
   */
  getAll(): ModuleRegistry {
    return this.registry;
  }

  /**
   * Get core (official) modules
   */
  getCore(): ModuleRegistryEntry[] {
    return this.registry.core;
  }

  /**
   * Get community modules
   */
  getCommunity(): ModuleRegistryEntry[] {
    return this.registry.community;
  }

  /**
   * Get user's private modules
   */
  getPrivate(): ModuleRegistryEntry[] {
    return this.registry.private;
  }

  /**
   * Search modules by query
   */
  search(query: string): ModuleRegistryEntry[] {
    const lowerQuery = query.toLowerCase();
    const allModules = [
      ...this.registry.core,
      ...this.registry.community,
      ...this.registry.private
    ];

    return allModules.filter(entry => {
      const { name, description, tags } = entry.metadata;
      return (
        name.toLowerCase().includes(lowerQuery) ||
        description.toLowerCase().includes(lowerQuery) ||
        tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Get module by ID
   */
  getById(moduleId: string): ModuleRegistryEntry | undefined {
    const allModules = [
      ...this.registry.core,
      ...this.registry.community,
      ...this.registry.private
    ];

    return allModules.find(entry => entry.metadata.id === moduleId);
  }

  /**
   * Get modules by category
   */
  getByCategory(category: string): ModuleRegistryEntry[] {
    const allModules = [
      ...this.registry.core,
      ...this.registry.community,
      ...this.registry.private
    ];

    return allModules.filter(entry => entry.metadata.category === category);
  }

  /**
   * Register a new community module
   */
  registerCommunityModule(entry: ModuleRegistryEntry): void {
    // Validate entry
    if (!entry.metadata.id || !entry.manifestUrl) {
      throw new Error('Invalid module registry entry');
    }

    // Check if module already exists
    const existing = this.getById(entry.metadata.id);
    if (existing) {
      throw new Error(`Module ${entry.metadata.id} already registered`);
    }

    this.registry.community.push(entry);
  }

  /**
   * Register a private module
   */
  registerPrivateModule(entry: ModuleRegistryEntry): void {
    // Validate entry
    if (!entry.metadata.id || !entry.manifestUrl) {
      throw new Error('Invalid module registry entry');
    }

    // Check if module already exists in private registry
    const existing = this.registry.private.find(
      e => e.metadata.id === entry.metadata.id
    );
    
    if (existing) {
      // Update existing
      const index = this.registry.private.indexOf(existing);
      this.registry.private[index] = entry;
    } else {
      this.registry.private.push(entry);
    }
  }

  /**
   * Remove a module from registry
   */
  removeModule(moduleId: string, registryType: 'community' | 'private'): void {
    if (registryType === 'community') {
      this.registry.community = this.registry.community.filter(
        entry => entry.metadata.id !== moduleId
      );
    } else {
      this.registry.private = this.registry.private.filter(
        entry => entry.metadata.id !== moduleId
      );
    }
  }

  /**
   * Update module stats (installations, rating)
   */
  updateStats(moduleId: string, stats: Partial<{ installations: number; rating: number; reviews: number }>): void {
    const allRegistries = [this.registry.core, this.registry.community, this.registry.private];
    
    for (const registry of allRegistries) {
      const entry = registry.find(e => e.metadata.id === moduleId);
      if (entry) {
        entry.stats = { ...entry.stats, ...stats };
        break;
      }
    }
  }
}

// Singleton instance
export const moduleRegistry = new ModuleRegistryService();
