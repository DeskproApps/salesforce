import {useRegisterHomeButton} from "../../hooks";
import {useParams} from "react-router-dom";
import {ListScreen} from "../../screens/list/ListScreen";
import { ActivityListScreen } from "../../screens/list/ActivitiyListScreen";

export const List = () => {
    useRegisterHomeButton();

    const { object, field, id } = useParams();

    if(object === "activity") return <ActivityListScreen id={id as string} field={field as string} />;

    return (<ListScreen object={object as string} field={field as string} id={id as string} />);
};
