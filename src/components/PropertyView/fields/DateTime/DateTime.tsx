type DateTimeProps = {
    value: string;
};

export const DateTime = ({ value }: DateTimeProps) => {
    return (
        <time dateTime={value}>
            {new Date(value).toLocaleString()}
        </time>
    );
};
