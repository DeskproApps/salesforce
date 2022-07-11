import {ReactNode} from "react";

type ContainerProps = {
    children: ReactNode;
};

export const Container = ({ children }: ContainerProps) => (
    <div style={{ padding: "10px" }}>
        {children}
    </div>
);
