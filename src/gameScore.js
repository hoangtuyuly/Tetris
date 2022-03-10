import React, {useState, useCallback, useEffect} from 'react'


export const GameScore = (fullRows) => {
    const [score, setScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [level, setLevel] = useState(0)
    const [rowCleared, setRowCleared] = useState(0)
    const point = [40, 100, 300, 1200]

    const scoreCal = useCallback(() => {
        if (fullRows > 0)
            setScore(state => state += point[fullRows - 1]*(level + 1))
            setRowCleared(state => state += fullRows)
            setLevel(Math.floor(rowCleared / 6))
    }, [level, point, fullRows])
    
    useEffect(() => {
        scoreCal()
    },[fullRows])

    return [score, setScore, level, setLevel, gameOver, setGameOver, rowCleared, setRowCleared]
}
