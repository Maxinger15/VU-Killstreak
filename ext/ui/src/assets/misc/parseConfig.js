function parseConfig(data) {
  if (!data) return null;
  if (typeof data === 'object') return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('[MusicConfig] JSON parse failed:', e.message);
      return null;
    }
  }
  return null;
}

export default parseConfig;