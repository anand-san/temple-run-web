# CLAUDE.md - Temple Run React Project Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build

## Code Style Guidelines

### Component Structure
- Use functional components with arrow functions
- Group hooks at the top (useState, useEffect, useRef)
- Place helper functions in the middle
- Return JSX at the bottom
- Use forwardRef when refs need to be passed

### Naming Conventions
- Components: PascalCase (Player, GameScene)
- Hooks: camelCase with "use" prefix (useKeyboardControls)
- Functions/variables: camelCase (handleKeyDown)
- Constants: UPPER_SNAKE_CASE for magic numbers

### Import Structure
1. React/hooks first
2. Third-party libraries next (react-three/fiber, three.js)
3. Local components/hooks last
4. Group imports by source with line breaks

### Three.js/React Three Fiber
- useFrame for animation loops
- useThree for Three.js context
- Element nesting should match 3D scene graph
- Import specific Three.js elements directly from 'three'

### Error Handling
- Use optional chaining for accessing ref properties
- Validate refs before use (if (ref.current))
- Add defensive checks for null/undefined values
- Use early returns in hooks when updates not needed