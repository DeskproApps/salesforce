import {useRegisterHomeButton} from "../../hooks";
import {ViewScreen} from "../../screens/view/ViewScreen";
import {useParams} from "react-router-dom";

export const View = () => {
    useRegisterHomeButton();

    const { object, id } = useParams();

    return (<ViewScreen object={object as string} id={id as string} />);
};
