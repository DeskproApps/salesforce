import { useState, Suspense } from "react";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import { HomeScreen } from "../../../screens/admin/mapping/account/HomeScreen";
import { ListScreen } from "../../../screens/admin/mapping/account/ListScreen";
import { ViewScreen } from "../../../screens/admin/mapping/account/ViewScreen";
import { LoadingSpinner, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { Reveal } from "../../../components/Reveal/Reveal";

export const Account = () => {
    const { context } = useDeskproLatestAppContext();

    const [activeTab, setActiveTab] = useState(0);

    const tabs: TabBarItemType[] = [
        {
            label: "Home Screen",
        },
        {
            label: "List Screen",
        },
        {
            label: "View Screen",
        },
    ];

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
                <Reveal show={activeTab === 0}>
                    <HomeScreen />
                </Reveal>
                <Reveal show={activeTab === 1}>
                    <ListScreen />
                </Reveal>
                <Reveal show={activeTab === 2}>
                    <ViewScreen />
                </Reveal>
            </Suspense>
        </>
    );
};
