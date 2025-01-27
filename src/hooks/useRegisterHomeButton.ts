import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useBasePath } from "./useBasePath";

/**
 * Register a home button pointing to the base path
 */
const useRegisterHomeButton = () => {
    const basePath = useBasePath();

    useInitialisedDeskproAppClient((client) => {
        client.registerElement("home", {
            type: "home_button",
            payload: { basePath },
        });
    }, [basePath]);
};

export { useRegisterHomeButton };
