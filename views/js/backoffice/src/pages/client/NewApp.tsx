import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Input, Form, Card } from "antd";
import { Redirect } from "react-router-dom";
import { CREATE_APP } from "../../api/mutations";
import { CreateApp, CreateAppVariables } from "../../api/types/CreateApp";

const NewApp = () => {
  const storeInfo: { link: string; name: string } | undefined = (window as any)
    .__YOWNES_STORE_INFO__;
  const [create, { data, loading }] = useMutation<
    CreateApp,
    CreateAppVariables
  >(CREATE_APP);

  useEffect(() => {
    if (storeInfo) {
      create({
        variables: {
          data: {
            apiLink: storeInfo.link,
            name: storeInfo.name,
          },
        },
      });
    }
  }, [storeInfo]);
  if (data?.createApp?.ok) {
    return <Redirect to={`/app/${data.createApp.storeApp?.id}`} />;
  }
  return (
    <Card>
      <Form
        initialValues={{
          name: storeInfo?.name,
          apiLink: storeInfo?.link,
        }}
        onFinish={(values) => {
          create({
            variables: { data: { apiLink: values.apiLink, name: values.name } },
          });
        }}
      >
        <Form.Item
          name="name"
          label="Nombre de la app"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="apiLink"
          label="Dirección de la tienda"
          rules={[{ required: true }]}
        >
          <Input disabled={Boolean(storeInfo?.link)} type="url" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            loading={loading}
          >
            {loading ? "Comprobando..." : "Comprobar"}
          </Button>
        </Form.Item>
      </Form>
      {storeInfo?.link && !data?.createApp?.ok && (
        <div>Comprueba que la dirección es correcta</div>
      )}
      {!storeInfo?.link && (
        <div>
          <h2>Instalación</h2>
          <p>
            Instala el plugin en tu plataforma de tienda online e introduce en
            la parte de arriba la dirección web para comprobar que es accesible
          </p>
        </div>
      )}
      {data?.createApp?.error && <span>{data.createApp.error}</span>}
    </Card>
  );
};

export default NewApp;
