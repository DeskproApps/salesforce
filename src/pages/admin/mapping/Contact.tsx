import {useState, Suspense, useCallback} from "react";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import { HomeScreen } from "../../../screens/admin/mapping/contact/HomeScreen";
import { ViewScreen } from "../../../screens/admin/mapping/contact/ViewScreen";
import {LoadingSpinner, useDeskproLatestAppContext, useInitialisedDeskproAppClient} from "@deskpro/app-sdk";
import { Reveal } from "../../../components/Reveal/Reveal";
import {ContactLayout} from "../../../types";
import {HomeLayout, ViewLayout} from "../../../screens/admin/types";
import defaultContactLayout from "../../../resources/default_layout/contact.json";

export const Contact = () => {
    const { context } = useDeskproLatestAppContext();

    const [activeTab, setActiveTab] = useState(0);

    const [layout, setLayout] = useState<ContactLayout>(
        context?.settings.mapping_contact
            ? JSON.parse(context?.settings.mapping_contact)
            : defaultContactLayout
    );

    useInitialisedDeskproAppClient((client) => {
        client.setAdminSetting(JSON.stringify(layout));
    }, [layout]);

    const setHomeLayout = useCallback((home: HomeLayout) => setLayout((layout) => ({
        ...layout,
        home,
    })), []);

    const setViewLayout = useCallback((view: ViewLayout) => setLayout((layout) => ({
        ...layout,
        view,
    })), []);

    const tabs: TabBarItemType[] = [
        {
            label: "Contact Home Screen",
        },
        {
            label: "Contact View Screen",
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
                        <HomeScreen onChange={setHomeLayout} value={layout.home} />
                    </Reveal>
                    <Reveal show={activeTab === 1}>
                        <ViewScreen onChange={setViewLayout} value={layout.view} />
                    </Reveal>
                </div>
            </Suspense>
        </>
    );
};
