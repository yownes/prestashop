import React, { ReactNode } from "react";
import { useQuery } from "@apollo/client";
import { Descriptions, Typography } from "antd";
import UserState from "./UserState";
import { AccountBasicData } from "../../api/types/AccountBasicData";
import { MyAccount } from "../../api/types/MyAccount";
import { MY_ACCOUNT } from "../../api/queries";
import { useTranslation } from "react-i18next";
import VerifiedState from "./VerifiedState";
import Loading from "../atoms/Loading";

interface ProfileInfoProps {
  profile?: AccountBasicData | null;
  action?: ReactNode;
  verified?: boolean;
}

const ProfileInfo = ({ profile, action, verified }: ProfileInfoProps) => {
  const { data } = useQuery<MyAccount>(MY_ACCOUNT);
  const { t } = useTranslation();
  if (!data?.me) {
    return <Loading />;
  }
  return (
    <Descriptions
      title={<Typography.Title level={2}>{t("profileInfo")}</Typography.Title>}
      layout="vertical"
      size="small"
      bordered
      extra={action}
      column={{ xs: 1, sm: 2, md: 3, lg: 4 }}
    >
      {profile?.username && (
        <Descriptions.Item label={t("username")}>
          {profile.username}
        </Descriptions.Item>
      )}
      {profile?.id && data?.me.isStaff && (
        <Descriptions.Item label={t("id")}>{profile.id}</Descriptions.Item>
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
      {verified && data?.me.isStaff && (
        <Descriptions.Item label={t("verifiedStatus")}>
          <VerifiedState verified={profile?.verified} />
        </Descriptions.Item>
      )}
      {data?.me.isStaff && (
        <Descriptions.Item label={t("isActive")}>
          <VerifiedState verified={profile?.isActive} />
        </Descriptions.Item>
      )}
      {data?.me.isStaff && (
        <Descriptions.Item label={t("plan")}>{"PLAN"}</Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default ProfileInfo;
