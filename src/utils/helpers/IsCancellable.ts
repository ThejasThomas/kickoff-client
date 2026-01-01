export const isHostedGameCancellable = (
  slotDate: string,
  startTime: string
): boolean => {
  const now = new Date()

  // Build game start datetime
  const gameStart = new Date(`${slotDate}T${startTime}:00`)

  const diffMs = gameStart.getTime() - now.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  return diffHours >= 1
}
