/** Somente eventos de autenticação, nunca a data de emissão do JWT renovado. */
export function recentAuth(
  events: unknown,
  methods: readonly string[],
  now = Date.now(),
) {
  if (!Array.isArray(events)) return false;
  const seconds = now / 1000;
  return events.some(
    (event) =>
      event &&
      methods.includes(event.method) &&
      Number.isFinite(event.timestamp) &&
      seconds >= event.timestamp &&
      seconds - event.timestamp < 300,
  );
}
