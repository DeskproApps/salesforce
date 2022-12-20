import {useState, Suspense, useCallback} from "react";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import {LoadingSpinner, useDeskproLatestAppContext, useInitialisedDeskproAppClient} from "@deskpro/app-sdk";
import { Reveal } from "../../../components/Reveal/Reveal";
import {EventLayout} from "../../../types";
import {ListLayout, ViewLayout} from "../../../screens/admin/types";
import defaultContactLayout from "../../../resources/default_layout/event.json";
import {ListScreen} from "../../../screens/admin/mapping/event/ListScreen";
import {ViewScreen} from "../../../screens/admin/mapping/event/ViewScreen";

export const Event = () => {
    const { context } = useDeskproLatestAppContext();

    const [activeTab, setActiveTab] = useState(0);

    const [layout, setLayout] = useState<EventLayout>(
        context?.settings.mapping_event
            ? JSON.parse(context?.settings.mapping_event)
            : defaultContactLayout
    );

    useInitialisedDeskproAppClient((client) => {
        client.setAdminSetting(JSON.stringify(layout));
    }, [layout]);

    const setListLayout = useCallback((list: ListLayout) => setLayout((layout) => ({
        ...layout,
        list,
    })), []);

    const setViewLayout = useCallback((view: ViewLayout) => setLayout((layout) => ({
        ...layout,
        view,
    })), []);

    const tabs: TabBarItemType[] = [
        {
            label: "Event List Screen",
        },
        {
            label: "Event View Screen",
        },
    ];

    if (!context?.settings) {
        return null;
    }

    if (!context?.settings?.global_access_token) {
        return (
            <div style={{ padding: "12px" }}>
                Please sign-in as global Salesforce user before mapping fields
            </div>
        );
    }

    return (
        <>
            <TabBar
                type="tab"
                tabs={tabs}
                activeIndex={activeTab}
                onClickTab={(index) => setActiveTab(index)}
                containerStyles={{ padding: "0 12px", justifyContent: "flex-start", marginTop: "18px", gap: "10px" }}
            />
            <Suspense fallback={<LoadingSpinner />}>
                <div style={{ padding: "16px" }}>
                    <Reveal show={activeTab === 0}>
                        <ListScreen onChange={setListLayout} value={layout.list} />
                    </Reveal>
                    <Reveal show={activeTab === 1}>
                        <ViewScreen onChange={setViewLayout} value={layout.view} />
                    </Reveal>
                </div>
            </Suspense>
        </>
    );
};