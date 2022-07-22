import {ContactLayout, Layout, Settings} from "./types";
import { match } from "ts-pattern";
import defaultContactLayout from "./resources/default_layout/contact.json";
import {HomeLayout, LayoutType, ListLayout, ViewLayout} from "./screens/admin/types";

export const getObjectPermalink = (settings: Settings|null|undefined, path: string) => settings ? `${settings.salesforce_instance_url}${path}` : '#';

export function getScreenLayout(settings: Settings|undefined, object: Layout["type"], screen: "home"): HomeLayout;
export function getScreenLayout(settings: Settings|undefined, object: Layout["type"], screen: "list"): ListLayout;
export function getScreenLayout(settings: Settings|undefined, object: Layout["type"], screen: "view"): ViewLayout;
export function getScreenLayout(settings: Settings|undefined, object: Layout["type"], screen: "home"|"list"|"view"): LayoutType {
    return match([object, screen])
        .with(["Contact", "home"], () => {
            const layout: ContactLayout = settings?.mapping_contact
                ? JSON.parse(settings.mapping_contact)
                : defaultContactLayout
            ;

            return layout.home;
        })
        .with(["Contact", "view"], () => {
            const layout: ContactLayout = settings?.mapping_contact
                ? JSON.parse(settings.mapping_contact)
                : defaultContactLayout
            ;

            return layout.view;
        })
        .run()
    ;
}
