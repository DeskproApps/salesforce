import { useLocation } from "react-router-dom";
import { useEffect } from "react";

type WindowWithIframeResizer = Window & typeof globalThis & {
    parentIFrame: {
        size: (h: number, w?: number) => void;
    };
};

export const ScrollTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const win = window as WindowWithIframeResizer;

        if (!win.parentIFrame) {
            return;
        }

        setTimeout(() => win.parentIFrame.size(0), 100);
    }, [pathname]);

    return null;
};
