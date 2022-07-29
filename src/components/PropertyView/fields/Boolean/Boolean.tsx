import "./Boolean.css";

type BooleanProps = {
    value: boolean;
};

export const Boolean = ({ value }: BooleanProps) => {
    return (
        value
            ? <span className="sf-boolean">Yes</span>
            : <span className="sf-boolean">No</span>
    );
};
