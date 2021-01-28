import React, { ReactNode } from "react";
import { Descriptions, Typography } from "antd";
import UserState from "./UserState";
import { AccountBasicData } from "../../api/types/AccountBasicData";
import { useTranslation } from "react-i18next";
import VerifiedState from "./VerifiedState";

interface ProfileInfoProps {
  profile?: AccountBasicData | null;
  action?: ReactNode;
  verified?: boolean;
}

const ProfileInfo = ({ profile, action, verified }: ProfileInfoProps) => {
  const { t } = useTranslation();
  return (
    <Descriptions
      title={<Typography.Title level={2}>{t("profileInfo")}</Typography.Title>}
      layout="vertical"
      size="small"
      bordered
      extra={action}
      column={{ md: 2, xs: 1, sm: 2, lg: 4 }}
    >
      {profile?.username && (
        <Descriptions.Item label={t("username")}>
          {profile.username}
        </Descriptions.Item>
      )}
      {profile?.email && (
        <Descriptions.Item label={t("email")}>
          {profile.email}
        </Descriptions.Item>
      )}
      {profile?.accountStatus && (
        <Descriptions.Item label={t("accountStatus.title")}>
          <UserState state={profile.accountStatus} />
        </Descriptions.Item>
      )}
      {verified && (
        <Descriptions.Item label={t("verifiedStatus")}>
          <VerifiedState verified={profile?.verified} />
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default ProfileInfo;
