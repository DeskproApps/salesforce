import {
  LoadingSpinner,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import { Suspense, useCallback, useState } from "react";
import { Reveal } from "../../../components/Reveal/Reveal";
import defaultContactLayout from "../../../resources/default_layout/note.json";
import { ListScreen } from "../../../screens/admin/mapping/note/ListScreen";
import { ViewScreen } from "../../../screens/admin/mapping/note/ViewScreen";
import { ListLayout, ViewLayout } from "../../../screens/admin/types";
import { NoteLayout, Settings } from "../../../types";

export const Note = () => {
  const [settings, setSettings] = useState<Settings>();

  const [activeTab, setActiveTab] = useState(0);

  const [layout, setLayout] = useState<NoteLayout>(
    settings?.mapping_note
      ? JSON.parse(settings.mapping_note)
      : defaultContactLayout
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

  const setListLayout = useCallback(
    (list: ListLayout) =>
      setLayout((layout) => ({
        ...layout,
        list,
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
      label: "Note List Screen",
    },
    {
      label: "Note View Screen",
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
