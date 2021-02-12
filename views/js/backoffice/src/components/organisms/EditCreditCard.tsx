import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Button, Divider, Form, Input, Select, Space, Typography } from "antd";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Errors from "../molecules/Errors";
import { loadStripe, StripeError } from "@stripe/stripe-js";
import { MY_PAYMENT_METHODS } from "../../api/queries";
import { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import Loading from "../../components/atoms/Loading";
import { useTranslation } from "react-i18next";
import * as Countries from "../../data/countries.json";
import { FormInstance } from "antd/lib/form";

interface ICreditCard {
  brand: "visa" | "maestro" | "mastercard";
  checks: {
    address_line1_check?: string;
    address_postal_code_check?: string;
    cvc_check?: string;
  };
  exp_month: number;
  exp_year: number;
  last4: string;
}

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

enum Language {
  en = "en",
  es = "es",
  fr = "fr",
  ca = "ca",
  de = "de",
}

const stripePromise = loadStripe("pk_test_RG1KlTBaXWs8pCamCoLixIIu00FTwuG937");

interface EditCreditCardProps {
  card: string;
  cardId: string | null;
  onEdited: (paymentMethodId: string) => void;
  form?: FormInstance;
}

const EditCreditCardContainer = (props: EditCreditCardProps) => {
  return (
    <Elements stripe={stripePromise}>
      <EditCreditCard {...props} />
    </Elements>
  );
};

const EditCreditCard = ({
  card,
  cardId,
  onEdited,
  form,
}: EditCreditCardProps) => {
  const [editing, setEditing] = useState(false);
  const [errs, setErrs] = useState<StripeError>();
  const stripe = useStripe();
  const elements = useElements();
  const { t, i18n } = useTranslation(["translation", "client"]);
  const country = i18n.language.split("-")[0] as Language;
  const language = Language[country] ?? "es";
  const { loading, data } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const currentCard = card
    .replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/'/g, '"');
  const cardData: ICreditCard = JSON.parse(currentCard);
  const currentBilling = data?.me?.customer?.paymentMethods?.edges?.filter(
    (node) => node?.node?.stripeId === cardId
  );
  const currentBillingDetails = currentBilling?.[0]?.node?.billingDetails;
  const normalizedBilling = currentBillingDetails
    ?.replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/'/g, '"');
  const billingData: IBillingDetails = JSON.parse(normalizedBilling ?? "{}");
  useEffect(() => {
    form?.setFieldsValue({
      name: billingData?.name,
      email: billingData?.email,
      billingDirection: billingData?.address?.line1,
      country: billingData?.address?.country,
      province: billingData?.address?.state,
      city: billingData?.address?.city,
      phone: billingData?.phone,
    });
  }, [billingData, form]);
  console.log("[[billingData]]", billingData);
  if (loading) return <Loading />;

  return (
    <Form
      form={form}
      initialValues={{
        name: billingData?.name,
        email: billingData?.email,
        direction: billingData?.address?.line1,
        country: billingData?.address?.country,
        state: billingData?.address?.state,
        city: billingData?.address?.city,
        phone: billingData?.phone,
      }}
      validateMessages={{ required: t("client:requiredInput") }} // eslint-disable-line no-template-curly-in-string
      onFinish={async (values) => {
        setEditing(true);
        if (!stripe || !elements) {
          setEditing(false);
          return;
        }
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setEditing(false);
          return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.direction,
              state: values.state,
            },
            email: values.email,
            name: values.name,
            phone: values.phone ?? null,
          },
        });
        if (error) {
          setEditing(false);
          setErrs(error);
        } else {
          const paymentMethodId = paymentMethod?.id;
          if (!paymentMethodId) {
            setEditing(false);
            return;
          }
          setEditing(false);
          onEdited(paymentMethodId);
        }
      }}
    >
      <Typography.Text>
        {cardData.brand} **** **** **** {cardData.last4} ({cardData.exp_month}/
        {cardData.exp_year})
      </Typography.Text>
      <Divider />
      <Form.Item name="name" rules={[{ required: true }]} label={t("fullName")}>
        <Input placeholder={t("fullName")} />
      </Form.Item>
      <Form.Item name="email" rules={[{ required: true }]} label={t("email")}>
        <Input placeholder={t("email")} type="email" />
      </Form.Item>
      <Form.Item
        name="direction"
        rules={[{ required: true }]}
        label={t("location")}
      >
        <Input placeholder={t("location")} />
      </Form.Item>
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
      <Form.Item
        name="state"
        rules={[{ required: true }]}
        label={t("province")}
      >
        <Input placeholder={t("province")} />
      </Form.Item>
      <Form.Item name="city" rules={[{ required: true }]} label={t("city")}>
        <Input placeholder={t("city")} />
      </Form.Item>
      <Form.Item name="phone" label={t("phone")}>
        <Input placeholder={t("phone")} />
      </Form.Item>
      <Form.Item name="documentId" label={t("documentId")}>
        <Input placeholder={t("documentId")} />
      </Form.Item>
      <Errors
        errors={{
          nonFieldErrors: errs?.type
            ? [{ message: errs?.message || "", code: errs.type }]
            : undefined,
        }}
      />
      <Space direction="vertical" size="middle">
        <Typography.Text type="warning">
          {t("client:defaultPaymentMethodWarning")}
        </Typography.Text>
        <Button loading={editing} htmlType="submit" type="primary" size="large">
          {t("client:updatePaymentMethod")}
        </Button>
      </Space>
    </Form>
  );
};

export default EditCreditCardContainer;
