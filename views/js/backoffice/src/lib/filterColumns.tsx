import React from "react";
import get from "lodash/get";
import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface FilterDropdownProps {
  setSelectedKeys: (keys: string[]) => void;
  selectedKeys: string[];
  confirm: () => void;
  clearFilters: () => void;
}

export interface Filter {
  text: React.ReactNode;
  value: string | boolean;
}

export function getColumnSearchProps<T>(
  dataIndex: keyof T | string[],
  dataHolder: string,
  search: string,
  reset: string,
  render?: boolean
) {
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={dataHolder}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {reset}
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {search}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string | number | boolean, record: T): boolean => {
      const valuee = get(record, dataIndex);
      const regex = new RegExp(value as string, "i");
      return regex.test(valuee);
    },
    ...(render ? (text: React.ReactNode | string) => text : null),
  };
}

export function getColumnFilterProps<T>(
  dataIndex: keyof T | string[],
  filters: Filter[]
) {
  return {
    filters: filters,
    onFilter: (value: string | number | boolean, record: T): boolean => {
      const valuee = get(record, dataIndex) ?? "-";
      const regex = new RegExp(value as string, "i");
      return regex.test(valuee);
    },
  };
}
const handleSearch = (confirm: () => void) => {
  confirm();
};
const handleReset = (clearFilters: () => void) => {
  clearFilters();
};
