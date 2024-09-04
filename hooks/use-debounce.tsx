import { useState, useEffect } from "react"

export function useDebounce<T>(value:T, delay?:number): T {

    const [debounce, setDebounced] = useState<T>(value);

    useEffect(() =>{
        const timer = setTimeout(() => {
            setDebounced(value)
        }, delay || 500)

        return () => {
            clearTimeout(timer);
        }
    },[value, delay]);

    return debounce;
}