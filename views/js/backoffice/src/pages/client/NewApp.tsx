import React, { useCallback, useEffect } from "react";
import { ApolloCache, FetchResult, useMutation } from "@apollo/client";
import { Button, Input, Form, Card } from "antd";
import { Redirect } from "react-router-dom";
import { CREATE_APP } from "../../api/mutations";
import { CreateApp, CreateAppVariables } from "../../api/types/CreateApp";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";

const NewApp = () => {
  const storeInfo: { link: string; name: string } | undefined = (window as any)
    .__YOWNES_STORE_INFO__;
  const { t } = useTranslation("client");
  const { user } = useAuth();
  const [create, { data, loading }] = useMutation<
    CreateApp,
    CreateAppVariables
  >(CREATE_APP);

  const update = useCallback((cache: ApolloCache<CreateApp>,
    { data }: FetchResult<CreateApp, Record<string, any>, Record<string, any>>) => {
    if (data?.createApp?.ok) {
      const me = cache.identify({ ...user });
      const node = cache.identify({ ...data.createApp?.storeApp });
      cache.modify({
        id: me,
        fields: {
          apps(existing) {
            return {
              edges: [...existing.edges, { node }],
            };
          },
        },
      });
    }
  }, [user])

  useEffect(() => {
    if (storeInfo) {
      create({
        variables: {
          data: {
            apiLink: storeInfo.link,
            name: storeInfo.name,
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
            variables: { data: { apiLink: values.apiLink, name: values.name } },
            update,
          });
        }}
      >
        <Form.Item
          name="name"
          label={t("appName")}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="apiLink"
          label={t("storeLocation")}
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
            {loading ? t("checking") : t("check")}
          </Button>
        </Form.Item>
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
      {data?.createApp?.error && <span>{data.createApp.error}</span>}
    </Card>
  );
};

export default NewApp;
