# Module Repository

Community-driven repository of Tetrahedron Protocol modules.

## Structure

```
/core          - Official modules maintained by protocol team
/community     - User-contributed modules
/templates     - Templates for creating new modules
```

## Core Modules

### Calendar Module
**ID**: `calendar`  
**Version**: 1.0.0  
**Author**: Tetrahedron Protocol  
**License**: CC-BY-4.0

Schedule coordination, events, reminders, and cross-platform sync.

**Install**: Available by default in all hubs

---

### Status Module (Phenix Navigator)
**ID**: `status`  
**Version**: 1.0.0  
**Author**: Tetrahedron Protocol  
**License**: CC-BY-4.0

Real-time availability, health, mood, and needs broadcasting.

**Install**: Available by default in all hubs

---

### Parenting Module
**ID**: `parenting`  
**Version**: 1.0.0  
**Author**: Tetrahedron Protocol  
**License**: CC-BY-4.0  
**Dependencies**: `calendar`

Co-parent communication, custody calendar, rule alignment, and transition protocols.

**Install**: Available by default in all hubs

---

### Kids Module
**ID**: `kids`  
**Version**: 1.0.0  
**Author**: Tetrahedron Protocol  
**License**: CC-BY-4.0

Age-appropriate support content for children (5-17) navigating family systems.

**Install**: Available by default in all hubs

---

## Community Modules

Coming soon! The community repository will launch with the Module Creator tool.

Community members will be able to:
- Create custom modules
- Fork existing modules
- Share modules with others
- Rate and review modules
- Collaborate on module development

## Creating a Module

See [Module Creator Guide](./CREATING_MODULES.md) for detailed instructions.

### Quick Start

1. **Define your four vertices**: Every module must have exactly 4 vertices following the tetrahedron pattern
2. **Implement the docking interface**: Connect to the hub and other modules
3. **Build your UI components**: React components for main view, settings, widgets
4. **Test locally**: Use the module creator tool's testing environment
5. **Publish**: Submit to community repository or keep private

### Module Template

```typescript
import { BaseModule } from '@/lib/modules/BaseModule';
import type { ModuleMetadata, Vertex } from '@/lib/types/module';

export class MyModule extends BaseModule {
  constructor() {
    const metadata: ModuleMetadata = {
      id: 'my-module',
      name: 'My Module',
      description: 'What this module does',
      author: 'Your Name',
      version: '1.0.0',
      license: 'CC-BY-4.0',
      category: 'custom',
      tags: ['tag1', 'tag2'],
      dependencies: [],
      lastUpdated: new Date()
    };

    const vertices: [Vertex, Vertex, Vertex, Vertex] = [
      {
        id: 'my-vertex-1',
        name: 'Vertex 1',
        category: 'technical',
        description: 'First vertex'
      },
      {
        id: 'my-vertex-2',
        name: 'Vertex 2',
        category: 'emotional',
        description: 'Second vertex'
      },
      {
        id: 'my-vertex-3',
        name: 'Vertex 3',
        category: 'practical',
        description: 'Third vertex'
      },
      {
        id: 'my-vertex-4',
        name: 'Vertex 4',
        category: 'philosophical',
        description: 'Fourth vertex'
      }
    ];

    super(metadata, vertices);
  }

  async initialize(): Promise<void> {
    // Initialize your module
  }

  async destroy(): Promise<void> {
    // Clean up
  }
}
```

## Module Guidelines

### Architecture
- **Four vertices**: Always exactly 4 vertices (tetrahedron pattern)
- **Six edges**: Complete graph (K4) connecting all vertices
- **Sovereign**: Module works standalone, docking is optional
- **Composable**: Can communicate with other modules via hub

### Data
- **Local storage**: Modules manage their own data
- **Hub sharing**: Only share what's necessary with hub
- **Privacy**: Respect user privacy and data minimization
- **Backup**: Enable export/import for user data

### UI
- **Responsive**: Works on mobile and desktop
- **Accessible**: WCAG 2.1 AA compliance
- **Consistent**: Follow protocol design patterns
- **Fast**: Optimize for performance

### Code Quality
- **TypeScript**: Strong typing required
- **Tested**: Include unit tests
- **Documented**: Clear README and inline comments
- **Licensed**: Choose appropriate open source license

## Submission Process

1. **Develop module** using Module Creator tool
2. **Test thoroughly** in local environment
3. **Create GitHub repository** for your module
4. **Submit pull request** to community repository
5. **Review process** by protocol team
6. **Published** to community directory

## Module Categories

- **Parenting**: Co-parenting, custody, child development
- **Productivity**: Tasks, calendars, organization
- **Health**: Mental health, physical wellness, medical
- **Education**: Learning, tutoring, school support
- **Communication**: Messaging, video, coordination
- **Coordination**: Scheduling, logistics, planning
- **Custom**: Anything else

## License Options

Recommended licenses for community modules:
- **CC-BY-4.0**: Creative Commons Attribution (most permissive)
- **MIT**: Permissive for code
- **GPL-3.0**: Copyleft for code

## Support

- **Documentation**: [Module Creator Guide](./CREATING_MODULES.md)
- **Community Forum**: Coming soon
- **Discord**: Coming soon
- **GitHub Issues**: [Report bugs](https://github.com/phenix-framework/modules/issues)

## Revenue Sharing

Module creators can:
- Offer free modules (donation-supported)
- Offer freemium modules (basic free, advanced paid)
- Offer paid modules (one-time or subscription)

**Revenue split**: 70% creator, 30% protocol (sustains infrastructure)

## Examples

Coming soon! We'll feature exemplary community modules here.

---

**The protocol is open. The modules are yours. Build what humans need.**
