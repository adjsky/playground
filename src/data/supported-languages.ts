const supportedLanguages = ["javascript", "typescript"] as const

export type SupportedLanguages = typeof supportedLanguages[number]

export default supportedLanguages
