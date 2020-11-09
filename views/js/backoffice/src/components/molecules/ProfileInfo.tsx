import React, { ReactNode } from "react";
import { Descriptions, Typography } from "antd";
import UserState from "./UserState";
import { AccountBasicData } from "../../api/types/AccountBasicData";

interface ProfileInfoProps {
  profile?: AccountBasicData | null;
  action?: ReactNode;
}

const ProfileInfo = ({ profile, action }: ProfileInfoProps) => {
  return (
    <Descriptions
      title={
        <Typography.Title level={2}>Información de perfil</Typography.Title>
      }
      layout="vertical"
      size="small"
      bordered
      extra={action}
      column={{ md: 2, xs: 1, sm: 2, lg: 3 }}
    >
      {profile?.username && (
        <Descriptions.Item label="Nombre de usuario">
          {profile.username}
        </Descriptions.Item>
      )}
      {profile?.email && (
        <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
      )}
      {profile?.accountStatus && (
        <Descriptions.Item label="Estado de la cuenta">
          <UserState state={profile.accountStatus} />
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default ProfileInfo;
