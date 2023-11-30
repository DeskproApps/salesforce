import {
  LoadingSpinner,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import { Suspense, useCallback, useState } from "react";
import { Reveal } from "../../../components/Reveal/Reveal";
import defaultLayout from "../../../resources/default_layout/lead.json";
import { HomeScreen } from "../../../screens/admin/mapping/lead/HomeScreen";
import { ViewScreen } from "../../../screens/admin/mapping/lead/ViewScreen";
import { HomeLayout, ViewLayout } from "../../../screens/admin/types";
import { LeadLayout, Settings } from "../../../types";

export const Lead = () => {
  const [settings, setSettings] = useState<Settings>();

  const [activeTab, setActiveTab] = useState(0);

  const [layout, setLayout] = useState<LeadLayout>(
    settings?.mapping_lead ? JSON.parse(settings.mapping_lead) : defaultLayout
  );

  useDeskproAppEvents({
    onAdminSettingsChange: (settings) => {
      setSettings(settings);
    },
  });

  useInitialisedDeskproAppClient(
    (client) => {
      client.setAdminSetting(JSON.stringify(layout));
    },
    [layout]
  );

  const setHomeLayout = useCallback(
    (home: HomeLayout) =>
      setLayout((layout) => ({
        ...layout,
        home,
      })),
    []
  );

  const setViewLayout = useCallback(
    (view: ViewLayout) =>
      setLayout((layout) => ({
        ...layout,
        view,
      })),
    []
  );

  const tabs: TabBarItemType[] = [
    {
      label: "Lead Home Screen",
    },
    {
      label: "Lead View Screen",
    },
  ];

  if (!settings) {
    return null;
  }

  if (!settings?.global_access_token) {
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
        containerStyles={{
          padding: "0 12px",
          justifyContent: "flex-start",
          marginTop: "18px",
          gap: "10px",
        }}
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
