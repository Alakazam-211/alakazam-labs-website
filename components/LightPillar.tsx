'use client';

import { useRef, useEffect, useState } from 'react';
import './LightPillar.css';

type LightPillarProps = {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: string;
  pillarRotation?: number;
};

// Lazy load Three.js only on client side
let THREE: any;
let loading = false;
let loaded = false;

async function loadThreeJS() {
  if (typeof window === 'undefined') return false;
  if (loaded && THREE) return true;
  
  if (loading) {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (loaded && THREE) return true;
  }
  
  loading = true;
  try {
    THREE = await import('three');
    if (THREE) {
      loaded = true;
      loading = false;
      return true;
    }
    throw new Error('Three.js module loaded but is undefined');
  } catch (e) {
    console.error('Failed to load Three.js:', e);
    loading = false;
    loaded = false;
    THREE = null;
    return false;
  }
}

const LightPillar = ({
  topColor = '#5227FF',
  bottomColor = '#FF9FFC',
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className = '',
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = 'screen',
  pillarRotation = 0
}: LightPillarProps) => {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<any>(null);
  const materialRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const geometryRef = useRef<any>(null);
  const mouseRef = useRef<any>(null);
  const timeRef = useRef(0);
  const handleResizeRef = useRef<(() => void) | null>(null);
  const handleMouseMoveRef = useRef<((event: MouseEvent) => void) | null>(null);
  const animateFunctionRef = useRef<((currentTime: number) => void) | null>(null); // Store animate function for resume
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const isInViewRef = useRef(true);
  const pausedRef = useRef(false);
  
  // Detect mobile and iOS Safari for optimizations
  const isMobileRef = useRef(false);
  const isIOSSafariRef = useRef(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Detect mobile
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    // Detect iOS Safari specifically
    const checkIOSSafari = () => {
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|OPiOS/.test(ua);
      isIOSSafariRef.current = isIOS && isSafari;
    };
    
    checkMobile();
    checkIOSSafari();
    
    // Re-check on resize
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load Three.js
  useEffect(() => {
    loadThreeJS().then((loaded) => {
      setThreeLoaded(loaded);
      if (loaded) {
        mouseRef.current = new THREE.Vector2(0, 0);
      }
    });
  }, []);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGLSupported(false);
      console.warn('WebGL is not supported in this browser');
    }
  }, []);

  // IntersectionObserver to pause when not visible (mobile optimization) and resume when visible
  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasInView = isInViewRef.current;
          isInViewRef.current = entry.isIntersecting;
          
          // Resume animation when component becomes visible again
          if (entry.isIntersecting && !wasInView && !pausedRef.current && 
              !rafRef.current && animateFunctionRef.current && 
              materialRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
            rafRef.current = requestAnimationFrame(animateFunctionRef.current);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading slightly before visible
        threshold: 0
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Pause when tab is hidden (battery optimization) and resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasPaused = pausedRef.current;
      pausedRef.current = document.hidden;
      
      // Resume animation when tab becomes visible again
      if (!document.hidden && wasPaused && isInViewRef.current && 
          !rafRef.current && animateFunctionRef.current && 
          materialRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
        rafRef.current = requestAnimationFrame(animateFunctionRef.current);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !webGLSupported || !threeLoaded || !THREE) {
      return;
    }

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;
    
    // CRITICAL FIX: If container already has dimensions, mark as ready immediately
    if (height > 0 && width > 0 && !containerReady) {
      setContainerReady(true);
      return; // Return to let effect re-run with containerReady=true
    }
    
    // CRITICAL FIX: Wait for container to have non-zero height before initializing WebGL
    // This is especially important on mobile where layout may not be ready immediately
    if (height === 0 || width === 0) {
      // Use ResizeObserver to wait for container to get dimensions
      const resizeObserver = new ResizeObserver(() => {
        if (!containerRef.current) return;
        
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        
        if (w > 0 && h > 0) {
          resizeObserver.disconnect();
          setContainerReady(true);
        }
      });
      
      resizeObserver.observe(container);
      
      // Also try immediate check after a frame
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;
          if (w > 0 && h > 0) {
            resizeObserver.disconnect();
            setContainerReady(true);
            return;
          }
        }
      });
      
      // Cleanup timeout
      const timeout = setTimeout(() => {
        resizeObserver.disconnect();
      }, 5000);
      
      return () => {
        resizeObserver.disconnect();
        clearTimeout(timeout);
      };
    }
    
    // Re-check dimensions when containerReady changes
    if (!containerReady) {
      return;
    }
    
    // Re-measure now that container is ready
    const finalWidth = container.clientWidth;
    const finalHeight = container.clientHeight;
    
    if (finalWidth === 0 || finalHeight === 0) {
      return;
    }
    
    // Setup function extracted to be reusable
    const setupWebGLRenderer = (container: HTMLDivElement, width: number, height: number) => {
      // Prevent double initialization
      if (rendererRef.current) {
        return;
      }

      // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'lowp',
        stencil: false,
        depth: false
      });
    } catch (error) {
      console.error('Failed to create WebGL renderer:', error);
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    
    // Unified pixel ratio optimization for all devices
    // Set to 1.0 for maximum performance (reduces render resolution significantly)
    // This provides the best performance while maintaining acceptable visual quality
    const pixelRatio = 1.0;
    
    renderer.setPixelRatio(pixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Convert hex colors to RGB
    const parseColor = (hex: string) => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };

    // Shader material
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uPillarRotation;
      varying vec2 vUv;

      const float PI = 3.141592653589793;
      const float EPSILON = 0.001;
      const float E = 2.71828182845904523536;
      const float HALF = 0.5;

      mat2 rot(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      // Procedural noise function
      float noise(vec2 coord) {
        float G = E;
        vec2 r = (G * sin(G * coord));
        return fract(r.x * r.y * (1.0 + coord.x));
      }

      // Apply layered wave deformation to position
      vec3 applyWaveDeformation(vec3 pos, float timeOffset) {
        float frequency = 1.0;
        float amplitude = 1.0;
        vec3 deformed = pos;
        
        for(float i = 0.0; i < 4.0; i++) {
          deformed.xz *= rot(0.4);
          float phase = timeOffset * i * 2.0;
          vec3 oscillation = cos(deformed.zxy * frequency - phase);
          deformed += oscillation * amplitude;
          frequency *= 2.0;
          amplitude *= HALF;
        }
        return deformed;
      }

      // Polynomial smooth blending between two values
      float blendMin(float a, float b, float k) {
        float scaledK = k * 4.0;
        float h = max(scaledK - abs(a - b), 0.0);
        return min(a, b) - h * h * 0.25 / scaledK;
      }

      float blendMax(float a, float b, float k) {
        return -blendMin(-a, -b, k);
      }

      void main() {
        vec2 fragCoord = vUv * uResolution;
        vec2 uv = (fragCoord * 2.0 - uResolution) / uResolution.y;
        
        // Apply 2D rotation to UV coordinates
        float rotAngle = uPillarRotation * PI / 180.0;
        uv *= rot(rotAngle);

        vec3 origin = vec3(0.0, 0.0, -10.0);
        vec3 direction = normalize(vec3(uv, 1.0));

        float maxDepth = 50.0;
        float depth = 0.1;

        mat2 rotX = rot(uTime * 0.3);
        if(uInteractive && length(uMouse) > 0.0) {
          rotX = rot(uMouse.x * PI * 2.0);
        }

        vec3 color = vec3(0.0);
        
        for(float i = 0.0; i < 100.0; i++) {
          vec3 pos = origin + direction * depth;
          pos.xz *= rotX;

          // Apply vertical scaling and wave deformation
          vec3 deformed = pos;
          deformed.y *= uPillarHeight;
          deformed = applyWaveDeformation(deformed + vec3(0.0, uTime, 0.0), uTime);
          
          // Calculate distance field using cosine pattern
          vec2 cosinePair = cos(deformed.xz);
          float fieldDistance = length(cosinePair) - 0.2;
          
          // Radial boundary constraint
          float radialBound = length(pos.xz) - uPillarWidth;
          fieldDistance = blendMax(radialBound, fieldDistance, 1.0);
          fieldDistance = abs(fieldDistance) * 0.15 + 0.01;

          vec3 gradient = mix(uBottomColor, uTopColor, smoothstep(15.0, -15.0, pos.y));
          color += gradient * pow(1.0 / fieldDistance, 1.0);

          if(fieldDistance < EPSILON || depth > maxDepth) break;
          depth += fieldDistance;
        }

        // Normalize by pillar width to maintain consistent glow regardless of size
        float widthNormalization = uPillarWidth / 3.0;
        color = tanh(color * uGlowAmount / widthNormalization);
        
        // Add noise postprocessing
        float rnd = noise(gl_FragCoord.xy);
        color -= rnd / 15.0 * uNoiseIntensity;
        
        gl_FragColor = vec4(color * uIntensity, 1.0);
      }
    `;

    // Unified shader parameter optimizations for all devices
    // Reduced noise intensity and optimized glow amount for better performance
    const optimizedNoiseIntensity = noiseIntensity * 0.5; // 40% reduction for all devices
    const optimizedGlowAmount = glowAmount * 1.2; // Slightly increase to compensate for reduced iterations
    
    // Unified shader optimizations - apply to all devices for consistent performance
    // Reduce raymarching iterations and maxDepth for better performance across all devices
    const optimizedFragmentShader = fragmentShader
      .replace(/float maxDepth = 50\.0;/, `float maxDepth = 30.0;`) // Reduced from 50.0 to 35.0 for all devices
      .replace(/for\(float i = 0\.0; i < 100\.0; i\+\+\)/, `for(float i = 0.0; i < 60.0; i++)`); // Reduced from 100 to 70 for all devices

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: optimizedFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
        uGlowAmount: { value: optimizedGlowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: optimizedNoiseIntensity },
        uPillarRotation: { value: pillarRotation }
      },
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    geometryRef.current = geometry;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse interaction - throttled for performance
    let mouseMoveTimeout: NodeJS.Timeout | null = null;
    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;

      if (mouseMoveTimeout) return;

      mouseMoveTimeout = setTimeout(() => {
        mouseMoveTimeout = null;
      }, 16); // ~60fps throttle

      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);
    };
    handleMouseMoveRef.current = handleMouseMove;

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Unified animation loop with optimized frame rate for all devices
    let lastTime = performance.now();
    // Unified 30fps for all devices - provides smooth animation while significantly reducing CPU/GPU load
    // This improves battery life and reduces heat generation across all devices
    const targetFPS = 30;
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!materialRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
        rafRef.current = null;
        return;
      }

      // CRITICAL FIX: Stop animation loop entirely when paused to save CPU
      if (!isInViewRef.current || pausedRef.current) {
        rafRef.current = null; // Stop the loop instead of continuing
        return;
      }

      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameTime) {
        timeRef.current += (frameTime / 1000) * rotationSpeed;
        materialRef.current.uniforms.uTime.value = timeRef.current;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        lastTime = currentTime - (deltaTime % frameTime);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Store animate function reference for resume capability
    animateFunctionRef.current = animate;
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    // Handle resize with debouncing
    let resizeTimeout: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        if (!rendererRef.current || !materialRef.current || !containerRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        rendererRef.current.setSize(newWidth, newHeight);
        materialRef.current.uniforms.uResolution.value.set(newWidth, newHeight);
      }, 150);
    };
    handleResizeRef.current = handleResize;

      window.addEventListener('resize', handleResize, { passive: true });
    };
    
    // Call setup function
    setupWebGLRenderer(container, finalWidth, finalHeight);

    // Cleanup
    return () => {
      // Remove event listeners
      if (handleResizeRef.current) {
        window.removeEventListener('resize', handleResizeRef.current);
        handleResizeRef.current = null;
      }
      if (handleMouseMoveRef.current && containerRef.current && interactive) {
        containerRef.current.removeEventListener('mousemove', handleMouseMoveRef.current);
        handleMouseMoveRef.current = null;
      }
      
      // Cleanup animation and resources
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (containerRef.current && rendererRef.current.domElement && containerRef.current.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }
      if (materialRef.current) {
        materialRef.current.dispose();
        materialRef.current = null;
      }
      if (geometryRef.current) {
        geometryRef.current.dispose();
        geometryRef.current = null;
      }
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, [
    topColor,
    bottomColor,
    intensity,
    rotationSpeed,
    interactive,
    glowAmount,
    pillarWidth,
    pillarHeight,
    noiseIntensity,
    pillarRotation,
    webGLSupported,
    threeLoaded,
    containerReady
  ]);

  if (!webGLSupported) {
    return (
      <div className={`light-pillar-fallback ${className}`} style={{ mixBlendMode: mixBlendMode as React.CSSProperties['mixBlendMode'] }}>
        WebGL not supported
      </div>
    );
  }

  // Get parent height to ensure container fills parent
  const [parentHeight, setParentHeight] = useState<number>(0);
  const parentResizeObserverRef = useRef<ResizeObserver | null>(null);
  const lastParentHeightRef = useRef<number>(0); // Track last height to prevent infinite loops
  
  // Set up parent height tracking when container ref is available
  useEffect(() => {
    const checkAndSetup = () => {
      if (!containerRef.current) {
        // Retry after a short delay if ref not ready
        setTimeout(checkAndSetup, 50);
        return;
      }
      
      const node = containerRef.current;
      
      // Set up parent height tracking
      const updateParentHeight = () => {
        if (node.parentElement) {
          const height = node.parentElement.clientHeight || node.parentElement.offsetHeight || 
                        parseInt(window.getComputedStyle(node.parentElement).height) || 0;
          // CRITICAL FIX: Only update if height actually changed (threshold of 1px to prevent loops)
          if (height > 0 && Math.abs(height - lastParentHeightRef.current) > 1) {
            lastParentHeightRef.current = height;
            setParentHeight(height);
            // Also set directly on the node as backup
            node.style.setProperty('height', `${height}px`, 'important');
          }
        }
      };
      
      // Initial update - use requestAnimationFrame to ensure parent has rendered
      requestAnimationFrame(() => {
        updateParentHeight();
        
        // Also try after a short delay to catch late layout
        setTimeout(updateParentHeight, 100);
      });
      
      // Watch for parent size changes
      if (node.parentElement) {
        if (parentResizeObserverRef.current) {
          parentResizeObserverRef.current.disconnect();
        }
        parentResizeObserverRef.current = new ResizeObserver(updateParentHeight);
        parentResizeObserverRef.current.observe(node.parentElement);
      }
    };
    
    checkAndSetup();
    
    return () => {
      if (parentResizeObserverRef.current) {
        parentResizeObserverRef.current.disconnect();
        parentResizeObserverRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Calculate height - prefer parentHeight, fallback to 100%
  const containerHeight = parentHeight > 0 ? `${parentHeight}px` : '100%';
  
  // Use callback ref to set height immediately when container mounts
  const containerCallbackRef = (node: HTMLDivElement | null) => {
    // Update the ref
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    
    if (node) {
      // Immediately set height from parent if available
      const parent = node.parentElement;
      if (parent) {
        // Use multiple methods to get parent height
        const parentHeightValue = parent.clientHeight || parent.offsetHeight || 
                                  parseInt(window.getComputedStyle(parent).height) || 0;
        
        // CRITICAL FIX: Only update if height actually changed to prevent loops
        if (parentHeightValue > 0 && Math.abs(parentHeightValue - lastParentHeightRef.current) > 1) {
          lastParentHeightRef.current = parentHeightValue;
          // Update state immediately - this will trigger a re-render
          setParentHeight(parentHeightValue);
          
          // Set directly via style IMMEDIATELY with !important to override React's style prop
          // This ensures the height is set before React can override it
          node.style.setProperty('height', `${parentHeightValue}px`, 'important');
          node.style.setProperty('position', 'absolute', 'important');
          node.style.setProperty('top', '0', 'important');
          node.style.setProperty('left', '0', 'important');
          node.style.setProperty('width', '100%', 'important');
          
          // Force a reflow to ensure styles are applied
          void node.offsetHeight;
          
          // Also set in RAF as backup in case React overrides it
          requestAnimationFrame(() => {
            if (node && node.parentElement) {
              const currentParentHeight = node.parentElement.clientHeight;
              if (currentParentHeight > 0 && node.clientHeight === 0) {
                // Only set if height is still 0 (React might have overridden it)
                node.style.setProperty('height', `${currentParentHeight}px`, 'important');
              }
            }
          });
        }
      }
    }
  };

  // Use the parentHeight directly in style to ensure it's always correct
  // The callback ref will also set it directly with !important as backup
  // Don't set height in React style prop if parentHeight is 0 - let callback ref handle it
  const finalHeight = parentHeight > 0 ? `${parentHeight}px` : undefined;
  
  return (
    <div 
      ref={containerCallbackRef} 
      className={`light-pillar-container ${className}`} 
      style={{ 
        mixBlendMode: mixBlendMode as React.CSSProperties['mixBlendMode'],
        ...(finalHeight ? { height: finalHeight } : {}), // Only set height if we have a value
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: parentHeight > 0 ? `${parentHeight}px` : undefined
      }} 
    />
  );
};

export default LightPillar;
