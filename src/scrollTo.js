// Route programmatic vertical navigation through the same smooth-scroll engine.
export function scrollToPosition(top) {
  window.dispatchEvent(new CustomEvent('understory:scroll', {detail:{top}}));
}
