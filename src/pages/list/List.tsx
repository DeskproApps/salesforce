import {useRegisterHomeButton} from "../../hooks";
import {useParams} from "react-router-dom";
import {ListScreen} from "../../screens/list/ListScreen";

export const List = () => {
    useRegisterHomeButton();

    const { object, field, id } = useParams();

    return (<ListScreen object={object as string} field={field as string} id={id as string} />);
};
