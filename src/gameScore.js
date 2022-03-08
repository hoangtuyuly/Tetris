import React, {useState, useCallback, useEffect} from 'react'


export const GameScore = () => {
    const [score, setScore] = useState(0)
    const [level, setLevel] = useState(0)
    const [gameOver, setGameOver] = useState(false)

    return [score, setScore, level, setLevel, gameOver, setGameOver]
}

