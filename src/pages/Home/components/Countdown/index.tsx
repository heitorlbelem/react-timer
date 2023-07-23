import { useContext, useEffect } from 'react'
import { CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export function Countdown() {
  const {
    activeCycle,
    finishActiveCycle,
    amountSecondsPassed,
    updateAmountSecondsPassed,
  } = useContext(CyclesContext)

  const totalSecondsAmount = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle
    ? totalSecondsAmount - amountSecondsPassed
    : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutesShown = String(minutesAmount).padStart(2, '0')
  const secondsShown = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSecondsAmount) {
          finishActiveCycle()
          updateAmountSecondsPassed(totalSecondsAmount)
          clearInterval(interval)
        } else {
          updateAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSecondsAmount,
    finishActiveCycle,
    updateAmountSecondsPassed,
  ])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutesShown}: ${secondsShown}`
    } else {
      document.title = 'Ignite Timer'
    }
  }, [minutesShown, secondsShown, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutesShown[0]}</span>
      <span>{minutesShown[1]}</span>
      <Separator>:</Separator>
      <span>{secondsShown[0]}</span>
      <span>{secondsShown[1]}</span>
    </CountdownContainer>
  )
}
