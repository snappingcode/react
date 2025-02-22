import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint: number = 768) => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= breakpoint);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= breakpoint);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return { isMobile };
};

export default useIsMobile;
