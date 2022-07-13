import { ReactNode } from "react";

type RevealProps = {
    children: ReactNode;
    show: boolean;
    display?: string;
};

export const Reveal = ({ children, show, display = "block" }: RevealProps) => (
    <div style={{ display: show ? display : "none" }}>
        {children}
    </div>
);
