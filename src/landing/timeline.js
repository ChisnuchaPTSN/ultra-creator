export const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
export const segment = (p, start, end) => clamp((p - start) / (end - start));
export const ease = n => n * n * (3 - 2 * n);

export function journey(p) {
  return {
    spaceApproach: ease(segment(p, 0, 0.32)),
    cloudDive: ease(segment(p, 0.30, 0.46)),
    birdGlide: ease(segment(p, 0.46, 0.68)),
    forestTravel: ease(segment(p, 0.68, 1.0)),
    stage: p < 0.32 ? 0 : p < 0.46 ? 1 : p < 0.68 ? 2 : p < 0.78 ? 3 : 4
  };
}
