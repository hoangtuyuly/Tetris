export const bricks = {
    I: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ],
        color: '#313B72'
    },

    L: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        color: '#6b4b7d'
    },

    J: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ],
        color: '#7079b3'
    },

    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: '#b36b92'
    },

    O: {
        shape: [
            [1, 1, 0],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: '#986bb3'
    },

    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: '#44633F'
    },

    T: {
        shape: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ],
        color: '#44633F'
    }
}

export const randomBrick = () => {
    const block = 'ILZJTOS';
    const randomSelection = block[Math.floor(Math.random() * block.length)]
    return bricks[randomSelection]
}