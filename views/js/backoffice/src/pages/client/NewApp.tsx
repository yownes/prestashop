import React, { useCallback, useEffect } from "react";
import { ApolloCache, FetchResult, useMutation } from "@apollo/client";
import { Button, Input, Form, Card, Space } from "antd";
import { Redirect } from "react-router-dom";
import { CREATE_APP } from "../../api/mutations";
import { CreateApp, CreateAppVariables } from "../../api/types/CreateApp";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";
import Errors from "../../components/molecules/Errors";
import { baseApp } from "./App";

const NewApp = () => {
  const storeInfo:
    | { link: string; name: string; color: { color: string; text: string } }
    | undefined = (window as any).__YOWNES_STORE_INFO__;
  const { t } = useTranslation("client");
  const { user } = useAuth();
  const [create, { data, loading }] = useMutation<
    CreateApp,
    CreateAppVariables
  >(CREATE_APP);

  const update = useCallback(
    function (
      cache: ApolloCache<CreateApp>,
      { data }: FetchResult<CreateApp, Record<string, any>, Record<string, any>>
    ) {
      if (data?.createApp?.ok) {
        const me = cache.identify({ ...user });
        cache.modify({
          id: me,
          fields: {
            apps(existing, { toReference }) {
              return {
                edges: [
                  ...existing.edges,
                  {
                    __typename: "StoreAppTypeEdge",
                    node: toReference({ ...data.createApp?.storeApp }),
                  },
                ],
              };
            },
          },
        });
      }
    },
    [user]
  );

  useEffect(() => {
    if (storeInfo) {
      create({
        variables: {
          data: {
            apiLink: storeInfo.link,
            name: storeInfo.name,
            color: baseApp.color,
          },
        },
        update,
      });
    }
  }, [storeInfo, create, update]);
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
            variables: {
              data: {
                apiLink: values.apiLink,
                name: values.name,
                color: baseApp.color,
              },
            },
            update,
          });
        }}
      >
        <Form.Item
          name="name"
          label={t("appName")}
          rules={[{ required: true, message: t("required.app") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="apiLink"
          label={t("storeLocation")}
          rules={[{ required: true, message: t("required.store") }]}
        >
          <Input disabled={Boolean(storeInfo?.link)} type="url" />
        </Form.Item>
        <Space direction="vertical" size="middle">
          {data?.createApp?.error && (
            <Errors
              errors={{
                nonFieldErrors: [
                  {
                    message: t(`appErrors.${data?.createApp?.error}`),
                    code: "error",
                  },
                ],
              }}
            />
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              loading={loading}
            >
              {loading ? t("checking") : t("check")}
            </Button>
          </Form.Item>
        </Space>
      </Form>
      {storeInfo?.link && !data?.createApp?.ok && (
        <div>{t("checkLocation")}</div>
      )}
      {!storeInfo?.link && (
        <div>
          <h2>{t("installInstructions.title")}</h2>
          <p>{t("installInstructions.description")}</p>
        </div>
      )}
    </Card>
  );
};

export default NewApp;
