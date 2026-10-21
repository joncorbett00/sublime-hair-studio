/** The squiggle under an accent word, as a CSS image in one colour (any CSS colour: hex, oklch…). */
export const squiggle = (colour) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'%3E%3Cpath d='M3 8c9.5-5.3 17.5-5.3 28.5 0s19 5.3 28.5 0 19-5.3 28.5 0 19 5.3 28.5 0' fill='none' stroke='${encodeURIComponent(colour)}' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`
