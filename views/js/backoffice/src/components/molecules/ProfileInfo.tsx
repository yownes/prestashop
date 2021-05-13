import React, { ReactNode } from "react";
import { useQuery } from "@apollo/client";
import { Descriptions, Typography } from "antd";
import UserState from "./UserState";
import { AccountBasicData } from "../../api/types/AccountBasicData";
import { MyAccount } from "../../api/types/MyAccount";
import { MY_ACCOUNT } from "../../api/queries";
import { useTranslation } from "react-i18next";
import format from "date-fns/format";
import VerifiedState from "./VerifiedState";
import Loading from "../atoms/Loading";

interface ProfileInfoProps {
  profile?: AccountBasicData | null;
  action?: ReactNode;
  verified?: boolean;
}

const { Text, Title } = Typography;

const ProfileInfo = ({ profile, action, verified }: ProfileInfoProps) => {
  const { data } = useQuery<MyAccount>(MY_ACCOUNT);
  const { t } = useTranslation();
  if (!data?.me) {
    return <Loading />;
  }
  return (
    <Descriptions
      title={<Title level={2}>{t("profileInfo")}</Title>}
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
      <Descriptions.Item label={t("plan")}>
        {profile?.subscription ? (
          <>
            <Text>{profile?.subscription?.plan?.product?.name} </Text>
            <Text>
              ({profile?.subscription?.plan?.amount}
              {profile.subscription.plan?.currency === "eur"
                ? "€"
                : profile.subscription.plan?.currency}
              {"/"}
              {t(`${profile.subscription.plan?.interval}`.toLocaleLowerCase())})
            </Text>
            <Text>, {t("currentPeriodEnd").toLocaleLowerCase()} </Text>
            <Text>
              {format(
                new Date(profile.subscription.currentPeriodEnd),
                "dd/MM/yyyy"
              )}
            </Text>
          </>
        ) : (
          <Text>{t("noPlan")}</Text>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ProfileInfo;
