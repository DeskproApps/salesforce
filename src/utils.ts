import { Settings } from "./types";

export const getObjectPermalink = (settings: Settings|null|undefined, path: string) => settings ? `${settings.salesforce_instance_url}${path}` : '#';
