import React from "react";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Build, BuildState } from "../../models/App";
import BuildStateVisualizer from "../../components/molecules/BuildState";

const columns: ColumnsType<Build> = [
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
      return <BuildStateVisualizer state={state}></BuildStateVisualizer>;;
    },
  },
];

const Builds = () => {
  const data: Build[] = [
    {
      id: "1",
      date: new Date(),
      app: {
        id: "1",
        name: "App1",
        customer: {
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
        id: "3",
        name: "App3",
        customer: {
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
        id: "3",
        name: "App3",
        customer: {
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
        id: "3",
        name: "App3",
        customer: {
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
        id: "3",
        name: "App3",
        customer: {
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
        id: "3",
        name: "App3",
        customer: {
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
