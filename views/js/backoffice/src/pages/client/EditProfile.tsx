import React from "react";
import { useQuery } from "@apollo/client";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { Link } from "react-router-dom";
import PaymentMethod from "./PaymentMethod";
import ChangePassword from "../../components/organisms/ChangePassword";
import PersonalData from "../../components/organisms/PersonalData";
import Loading from "../../components/atoms/Loading";
import { MY_PAYMENT_METHODS } from "../../api/queries";
import { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import { useTranslation } from "react-i18next";
import * as Countries from "../../data/countries.json";

interface IBillingDetails {
  address: {
    city: string;
    country: string;
    line1: string;
    postal_code: string;
    state: string;
  };
  email: string;
  name: string;
  phone: string;
}

const { Option } = Select;
const { Title } = Typography;

enum Language {
  en = "en",
  es = "es",
  fr = "fr",
  ca = "ca",
  de = "de",
}

const EditProfile = () => {
  const { t, i18n } = useTranslation(["translation", "client"]);
  const country = i18n.language.split("-")[0] as Language;
  const language = Language[country] ?? "es";
  const { loading, data } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const defaultBilling = data?.me?.customer?.paymentMethods?.edges?.filter(
    (node) =>
      node?.node?.stripeId ===
      data?.me?.customer?.defaultPaymentMethod?.stripeId
  );
  const defaultBillingDetails = defaultBilling?.[0]?.node?.billingDetails;
  const normalizedBilling = defaultBillingDetails
    ?.replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/'/g, '"');
  const billingData: IBillingDetails = JSON.parse(normalizedBilling ?? "{}");

  if (loading) return <Loading />;

  return (
    <Form
      initialValues={{
        name: billingData?.name,
        email: billingData?.email,
        billingDirection: billingData?.address?.line1,
        country: billingData?.address?.country,
        province: billingData?.address?.state,
        city: billingData?.address?.city,
        phone: billingData?.phone,
      }}
      onFinish={(values) => {
        //TODO: send to server
        console.log("Finish form", values);
      }}
      validateMessages={{ required: t("client:requiredInput") }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <PersonalData />
        </Col>
        <Col span={24}>
          <Card>
            <Title level={2}>{t("client:paymentMethod")}</Title>
            <PaymentMethod />
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Title level={2}>{t("client:billingData")}</Title>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Form.Item
                  name="name"
                  rules={[{ required: true }]}
                  label={t("fullName")}
                >
                  <Input placeholder={t("fullName")} />
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="email"
                  rules={[{ required: true }]}
                  label={t("email")}
                >
                  <Input disabled placeholder={t("email")} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Form.Item
                  name="billingDirection"
                  rules={[{ required: true }]}
                  label={t("client:billingDirection")}
                >
                  <Input placeholder={t("client:billingDirection")} />
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="country"
                  rules={[{ required: true }]}
                  label={t("country")}
                >
                  <Select
                    optionFilterProp="children"
                    placeholder={t("country")}
                    showSearch
                  >
                    {Object.entries(Countries.countries).map(([key, value]) => (
                      <Option key={key} value={key}>
                        {value[language] ?? value.es}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Form.Item
                  name="province"
                  rules={[{ required: true }]}
                  label={t("province")}
                >
                  <Input placeholder={t("province")} />
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="city"
                  rules={[{ required: true }]}
                  label={t("city")}
                >
                  <Input placeholder={t("city")} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Col md={12} sm={24}>
                <Form.Item name="phone" label={t("phone")}>
                  <Input placeholder={t("phone")} />
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item name="documentId" label={t("documentId")}>
                  <Input placeholder={t("documentId")} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[15, 15]}>
              <Button
                htmlType="submit"
                type="primary"
                //disabled={loading}
                //loading={loading}
              >
                {t("client:saveChanges")}
              </Button>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <ChangePassword />
          </Card>
        </Col>
      </Row>
      <Row>
        <Link to="/profile">
          <Button danger>{t("cancel")}</Button>
        </Link>
      </Row>
    </Form>
  );
};

export default EditProfile;
