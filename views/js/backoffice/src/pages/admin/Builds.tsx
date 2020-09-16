import React from "react";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";

interface ClientType {
  id: string;
  name: string;
}

interface AppType {
  name: string;
  client: ClientType;
}

enum BuildState {
  STALLED = "STALLED",
  QUEUED = "QUEUED",
  GENERATING = "GENERATING",
  UPLOADING = "UPLOADING",
  PUBLISHED = "PUBLISHED",
  WAITING = "WAITING",
}

interface BuildType {
  id: string;
  date: Date;
  app: AppType;
  state: BuildState;
}

const COLORS = {
  STALLED: "default",
  QUEUED: "gold",
  GENERATING: "cyan",
  UPLOADING: "magenta",
  PUBLISHED: "green",
  WAITING: "orange",
};

const columns: ColumnsType<BuildType> = [
  {
    title: "Fecha",
    dataIndex: "date",
    key: "data",
    render: (date: Date) => date.toLocaleDateString(),
  },
  { title: "ID build", dataIndex: "id", key: "buildId" },
  { title: "Cliente", dataIndex: ["app", "client", "name"], key: "client" },
  { title: "ID Cliente", dataIndex: ["app", "client", "id"], key: "clientId" },
  { title: "App", dataIndex: ["app", "name"], key: "app" },
  {
    title: "Estado",
    dataIndex: "state",
    key: "state",
    render: (state: BuildState) => {
      const color = COLORS[state];
      return <Tag color={color}>{state}</Tag>;
    },
  },
];

const Builds = () => {
  const data: BuildType[] = [
    {
      id: "1",
      date: new Date(),
      app: {
        name: "App1",
        client: {
          id: "sdrt789hd1qegq823r23f",
          name: "Alejandro",
        },
      },
      state: BuildState.STALLED,
    },
    {
      id: "2",
      date: new Date(),
      app: {
        name: "App3",
        client: {
          id: "fgvewargbftrn4532",
          name: "Jesús",
        },
      },
      state: BuildState.QUEUED,
    },
    {
      id: "3",
      date: new Date(),
      app: {
        name: "App3",
        client: {
          id: "fgvewargbftrn4532",
          name: "Jesús",
        },
      },
      state: BuildState.GENERATING,
    },
    {
      id: "4",
      date: new Date(),
      app: {
        name: "App3",
        client: {
          id: "fgvewargbftrn4532",
          name: "Jesús",
        },
      },
      state: BuildState.UPLOADING,
    },
    {
      id: "5",
      date: new Date(),
      app: {
        name: "App3",
        client: {
          id: "fgvewargbftrn4532",
          name: "Jesús",
        },
      },
      state: BuildState.WAITING,
    },
    {
      id: "6",
      date: new Date(),
      app: {
        name: "App3",
        client: {
          id: "fgvewargbftrn4532",
          name: "Jesús",
        },
      },
      state: BuildState.PUBLISHED,
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Builds;
