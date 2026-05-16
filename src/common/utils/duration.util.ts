const unitToMs: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export function durationToMs(value: string, fallbackMs: number): number {
  const match = /^([0-9]+)(ms|s|m|h|d)$/.exec(value.trim());
  if (!match) {
    return fallbackMs;
  }

  const amount = Number(match[1]);
  const unit = match[2];

  if (!Number.isFinite(amount) || amount <= 0 || !unitToMs[unit]) {
    return fallbackMs;
  }

  return amount * unitToMs[unit];
}
