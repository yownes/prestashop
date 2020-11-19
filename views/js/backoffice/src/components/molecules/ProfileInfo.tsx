import React, { ReactNode } from "react";
import { Descriptions, Typography } from "antd";
import UserState from "./UserState";
import { AccountBasicData } from "../../api/types/AccountBasicData";
import { useTranslation } from "react-i18next";

interface ProfileInfoProps {
  profile?: AccountBasicData | null;
  action?: ReactNode;
}

const ProfileInfo = ({ profile, action }: ProfileInfoProps) => {
  const {t} = useTranslation()
  return (
    <Descriptions
      title={
        <Typography.Title level={2}>{t("profileInfo")}</Typography.Title>
      }
      layout="vertical"
      size="small"
      bordered
      extra={action}
      column={{ md: 2, xs: 1, sm: 2, lg: 3 }}
    >
      {profile?.username && (
        <Descriptions.Item label={t("username")}>
          {profile.username}
        </Descriptions.Item>
      )}
      {profile?.email && (
        <Descriptions.Item label={t("email")}>{profile.email}</Descriptions.Item>
      )}
      {profile?.accountStatus && (
        <Descriptions.Item label={t("accountStatus")}>
          <UserState state={profile.accountStatus} />
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default ProfileInfo;
