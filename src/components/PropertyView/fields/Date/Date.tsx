type DateProps = {
    value: string;
};

export const OnlyDate = ({ value }: DateProps) => {

    return (
        <time dateTime={value}>
            {new Date(value).toLocaleDateString()}
        </time>
    );
};