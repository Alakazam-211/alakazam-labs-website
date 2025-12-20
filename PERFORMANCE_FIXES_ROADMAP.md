# Performance Fixes Roadmap

This document tracks the incremental application of performance fixes, starting with the most critical issues.

## Current State
- **Baseline Branch**: `performance-fixes-baseline` (saved current state)
- **Working Branch**: `performance-fixes` (where we'll apply fixes)
- **Analysis Document**: `PERFORMANCE_ANALYSIS.md`

---

## Fix Priority Order

### ✅ Phase 1: Critical Performance Killers (Highest Impact)

#### Fix #1: Remove MagicRibbon Scroll/Resize Listeners
**Impact**: 30-40% scroll performance improvement  
**File**: `components/MagicRibbon.tsx`  
**Status**: ✅ Complete  
**Commit**: `Fix #1: Remove MagicRibbon scroll/resize listeners`

**Changes**:
- Remove `updateHeight` function
- Remove `useState` for height
- Remove scroll event listener
- Remove resize event listener
- Replace with CSS `height: 100%` or `min-height: 100vh`

**Test After**: Scroll performance, check MagicRibbon still displays correctly

---

#### Fix #2: Remove Page Height Management System
**Impact**: 50-60% CPU reduction, eliminates layout thrashing  
**File**: `app/page.tsx`  
**Status**: ⏳ Pending  
**Estimated Time**: 10 minutes

**Changes**:
- Remove entire `useEffect` hook (lines 63-236)
- Remove `forceSectionLayout()` function
- Remove `checkPageHeight()` function
- Remove `preventOverscroll()` function
- Remove all `setInterval` and `setTimeout` calls
- Remove scroll event listeners

**Test After**: 
- Page scrolling (especially mobile)
- Page height stability
- No scroll jank
- No "pop-in" effects

---

#### Fix #3: Optimize Font Loading
**Impact**: 20-30% faster initial load  
**File**: `app/layout.tsx`, `app/globals.css`  
**Status**: ⏳ Pending  
**Estimated Time**: 10 minutes

**Changes**:
- Replace Google Fonts CDN import with Next.js font optimization
- Use `next/font/google` for Montserrat
- Remove `@import url('https://fonts.googleapis.com/...')` from globals.css
- Add font-display: swap

**Test After**: Initial page load time, font rendering

---

### ✅ Phase 2: Medium Priority Fixes

#### Fix #4: Remove Loading Screen Delay
**Impact**: Immediate content visibility  
**File**: `app/page.tsx`  
**Status**: ⏳ Pending  
**Estimated Time**: 5 minutes

**Changes**:
- Remove or reduce 2-second `setTimeout` delay
- Show content immediately
- Keep LoadingScreen for actual loading states if needed

**Test After**: Initial render time

---

#### Fix #5: Simplify CSS - Remove Aggressive Overrides
**Impact**: Better browser optimization, reduced layout thrashing  
**File**: `app/globals.css`  
**Status**: ⏳ Pending  
**Estimated Time**: 15 minutes

**Changes**:
- Remove `contain: none !important` overrides
- Remove `content-visibility: visible !important` overrides
- Remove unnecessary `!important` flags
- Let browser optimize rendering naturally

**Test After**: Layout stability, no "pop-in" effects

---

#### Fix #6: Reduce Framer Motion Usage
**Impact**: Reduced animation overhead  
**Files**: Multiple component files  
**Status**: ⏳ Pending  
**Estimated Time**: 30 minutes

**Changes**:
- Remove scroll-triggered animations
- Replace with CSS animations where possible
- Keep only essential animations
- Remove `AnimatePresence` if not needed

**Test After**: Animation smoothness, scroll performance

---

### ✅ Phase 3: Low Priority Optimizations

#### Fix #7: Component Optimization
**Impact**: Reduced bundle size, faster hydration  
**Status**: ⏳ Pending  
**Estimated Time**: 20 minutes

**Changes**:
- Code split heavy components
- Lazy load below-the-fold content
- Reduce component nesting

---

#### Fix #8: Bundle Size Optimization
**Impact**: Faster initial load  
**Status**: ⏳ Pending  
**Estimated Time**: 15 minutes

**Changes**:
- Analyze bundle size
- Remove unused dependencies
- Tree-shake unused code

---

## Testing Checklist

After each fix, test:
- [ ] Desktop scrolling performance
- [ ] Mobile scrolling performance
- [ ] Initial page load time
- [ ] Layout stability (no pop-in)
- [ ] Visual appearance (no broken layouts)
- [ ] Browser console (no errors)
- [ ] Mobile device testing (if possible)

---

## Rollback Plan

If any fix causes issues:
```bash
# View what changed
git diff performance-fixes-baseline

# Revert a specific commit
git revert <commit-hash>

# Or reset to baseline
git reset --hard performance-fixes-baseline
```

---

## Progress Tracking

- [ ] Fix #1: MagicRibbon Scroll Listeners
- [ ] Fix #2: Page Height Management
- [ ] Fix #3: Font Loading
- [ ] Fix #4: Loading Screen Delay
- [ ] Fix #5: CSS Overrides
- [ ] Fix #6: Framer Motion
- [ ] Fix #7: Component Optimization
- [ ] Fix #8: Bundle Size

---

## Notes

- Each fix should be committed separately for easy rollback
- Test thoroughly after each fix
- Document any issues encountered
- Measure performance improvements if possible
