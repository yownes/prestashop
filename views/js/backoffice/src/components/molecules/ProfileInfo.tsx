import React from "react";
import { Button, Descriptions } from "antd";
import { MyAccount_me } from "../../api/types/MyAccount";
import UserState from "./UserState";
import { Link } from "react-router-dom";

interface ProfileInfoProps {
  profile?: MyAccount_me | null;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  return (
    <>
      <Descriptions
        title="Información de perfil"
        layout="vertical"
        size="small"
        bordered
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
        {profile?.apps && (
          <Descriptions.Item label="Apps">
            {profile.apps.edges.length}
          </Descriptions.Item>
        )}
        {profile?.accountStatus && (
          <Descriptions.Item label="Estado de la cuenta">
            <UserState state={profile.accountStatus} />
          </Descriptions.Item>
        )}
      </Descriptions>
      <Link to="/profile/edit">
        <Button size="small">Editar</Button>
      </Link>
    </>
  );
};

export default ProfileInfo;
