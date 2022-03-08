import { useEffect, useRef } from "react";

export const SetTimeOut = (func, time) => {
    const ref = useRef()
    useEffect(() => {
        ref.current = func
    }, [func]);

    useEffect(() => {
        function tick() {
            ref.current()
        }

        if (time !== null) {
            const run = setInterval(tick, time)
            return () => {
                clearInterval(run)
            }
        }
    }, [time]);
} 