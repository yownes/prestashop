import { Typography } from "antd";
import React from "react";

import styles from "./SmallCreditCard.module.css";

interface SmallCreditCardProps {
  data: string;
}

interface ICreditCardStripe {
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

const CARDS = {
  visa: {
    darkColor: styles.limedark,
    lightColor: styles.lime,
    icon: `<svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="750px" height="471px" viewBox="0 0 750 471" enable-background="new 0 0 750 471" xml:space="preserve"><title>Slice 1</title><desc>Created with Sketch.</desc><g id="visa" sketch:type="MSLayerGroup"><path id="Shape" sketch:type="MSShapeGroup" fill="#0E4595" d="M278.198,334.228l33.36-195.763h53.358l-33.384,195.763H278.198L278.198,334.228z"/><path id="path13" sketch:type="MSShapeGroup" fill="#0E4595" d="M524.307,142.687c-10.57-3.966-27.135-8.222-47.822-8.222c-52.725,0-89.863,26.551-90.18,64.604c-0.297,28.129,26.514,43.821,46.754,53.185c20.77,9.597,27.752,15.716,27.652,24.283c-0.133,13.123-16.586,19.116-31.924,19.116c-21.355,0-32.701-2.967-50.225-10.274l-6.877-3.112l-7.488,43.823c12.463,5.466,35.508,10.199,59.438,10.445c56.09,0,92.502-26.248,92.916-66.884c0.199-22.27-14.016-39.216-44.801-53.188c-18.65-9.056-30.072-15.099-29.951-24.269c0-8.137,9.668-16.838,30.559-16.838c17.447-0.271,30.088,3.534,39.936,7.5l4.781,2.259L524.307,142.687"/><path id="Path" sketch:type="MSShapeGroup" fill="#0E4595" d="M661.615,138.464h-41.23c-12.773,0-22.332,3.486-27.941,16.234l-79.244,179.402h56.031c0,0,9.16-24.121,11.232-29.418c6.123,0,60.555,0.084,68.336,0.084c1.596,6.854,6.492,29.334,6.492,29.334h49.512L661.615,138.464L661.615,138.464z M596.198,264.872c4.414-11.279,21.26-54.724,21.26-54.724c-0.314,0.521,4.381-11.334,7.074-18.684l3.607,16.878c0,0,10.217,46.729,12.352,56.527h-44.293V264.872L596.198,264.872z"/><path id="path16" sketch:type="MSShapeGroup" fill="#0E4595" d="M232.903,138.464L180.664,271.96l-5.565-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767,171.204l56.455-0.064l84.004-195.386L232.903,138.464"/><path id="path18" sketch:type="MSShapeGroup" fill="#F2AE14" d="M131.92,138.464H45.879l-0.682,4.073c66.939,16.204,111.232,55.363,129.618,102.415l-18.709-89.96C152.877,142.596,143.509,138.896,131.92,138.464"/></g></svg>`,
  },
  maestro: {
    darkColor: styles.yellowdark,
    lightColor: styles.yellow,
    icon: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="482.6" height="374.31" viewBox="0 0 482.6 374.31"> <title>maestro</title> <g> <path d="M278.8,421.77V397c0-9.35-6-15.64-15.55-15.72-5-.08-10.26,1.49-13.9,7-2.73-4.38-7-7-13.07-7a13.08,13.08,0,0,0-11.58,5.87v-4.88h-8.61v39.55h8.69V399.85c0-6.87,3.81-10.51,9.68-10.51,5.71,0,8.61,3.72,8.61,10.42v22h8.69V399.85c0-6.87,4-10.51,9.68-10.51,5.87,0,8.69,3.72,8.69,10.42v22ZM327.28,402V382.23h-8.61V387c-2.73-3.56-6.87-5.79-12.49-5.79-11.09,0-19.77,8.69-19.77,20.77s8.69,20.77,19.77,20.77c5.63,0,9.76-2.23,12.49-5.79v4.8h8.61Zm-32,0c0-6.95,4.55-12.66,12-12.66,7.12,0,11.91,5.46,11.91,12.66s-4.8,12.66-11.91,12.66C299.81,414.66,295.26,408.95,295.26,402ZM511.4,381.19a22.29,22.29,0,0,1,8.49,1.59,20.71,20.71,0,0,1,6.75,4.38,20,20,0,0,1,4.46,6.59,22,22,0,0,1,0,16.52,20,20,0,0,1-4.46,6.59,20.69,20.69,0,0,1-6.75,4.38,23.43,23.43,0,0,1-17,0,20.47,20.47,0,0,1-6.73-4.38,20.21,20.21,0,0,1-4.44-6.59,22,22,0,0,1,0-16.52,20.23,20.23,0,0,1,4.44-6.59,20.48,20.48,0,0,1,6.73-4.38A22.29,22.29,0,0,1,511.4,381.19Zm0,8.14a12.84,12.84,0,0,0-4.91.93,11.62,11.62,0,0,0-3.92,2.6,12.13,12.13,0,0,0-2.6,4,14.39,14.39,0,0,0,0,10.28,12.11,12.11,0,0,0,2.6,4,11.62,11.62,0,0,0,3.92,2.6,13.46,13.46,0,0,0,9.83,0,11.86,11.86,0,0,0,3.94-2.6,12,12,0,0,0,2.62-4,14.39,14.39,0,0,0,0-10.28,12,12,0,0,0-2.62-4,11.86,11.86,0,0,0-3.94-2.6A12.84,12.84,0,0,0,511.4,389.32ZM374.1,402c-.08-12.33-7.69-20.77-18.78-20.77-11.58,0-19.69,8.44-19.69,20.77,0,12.58,8.44,20.77,20.27,20.77,6,0,11.42-1.49,16.22-5.54l-4.22-6.37A18.84,18.84,0,0,1,356.4,415c-5.54,0-10.59-2.56-11.83-9.68h29.37C374,404.23,374.1,403.16,374.1,402Zm-29.45-3.47c.91-5.71,4.38-9.6,10.51-9.6,5.54,0,9.1,3.47,10,9.6Zm65.69-6.2A25.49,25.49,0,0,0,398,388.93c-4.72,0-7.53,1.74-7.53,4.63,0,2.65,3,3.39,6.7,3.89l4.05.58c8.61,1.24,13.82,4.88,13.82,11.83,0,7.53-6.62,12.91-18,12.91-6.45,0-12.41-1.66-17.13-5.13l4.05-6.7a21.07,21.07,0,0,0,13.16,4.14c5.87,0,9-1.74,9-4.8,0-2.23-2.23-3.47-6.95-4.14l-4.05-.58c-8.85-1.24-13.65-5.21-13.65-11.67,0-7.86,6.45-12.66,16.46-12.66,6.29,0,12,1.41,16.13,4.14Zm41.35-2.23H437.62V408c0,4,1.41,6.62,5.71,6.62a15.89,15.89,0,0,0,7.61-2.23l2.48,7.36a20.22,20.22,0,0,1-10.76,3.06c-10.18,0-13.73-5.46-13.73-14.65v-18h-8v-7.86h8v-12h8.69v12h14.06Zm29.78-8.85a18.38,18.38,0,0,1,6.12,1.08l-2.65,8.11a14,14,0,0,0-5.38-1c-5.63,0-8.44,3.64-8.44,10.18v22.17h-8.6V382.23H471V387a11.66,11.66,0,0,1,10.42-5.79Z" transform="translate(-132.9 -48.5)"/> <g id="_Group_" data-name="&lt;Group&gt;"> <rect x="176.05" y="31.89" width="130.5" height="234.51" fill="#7673c0"/> <path id="_Path_" data-name="&lt;Path&gt;" d="M317.24,197.64a148.88,148.88,0,0,1,57-117.26,149.14,149.14,0,1,0,0,234.51A148.88,148.88,0,0,1,317.24,197.64Z" transform="translate(-132.9 -48.5)" fill="#eb001b"/> <path d="M615.5,197.64A149.14,149.14,0,0,1,374.2,314.9a149.16,149.16,0,0,0,0-234.51A149.14,149.14,0,0,1,615.5,197.64Z" transform="translate(-132.9 -48.5)" fill="#00a1df"/> </g> </g></svg>`,
  },
  mastercard: {
    darkColor: styles.lightbluedark,
    lightColor: styles.lightblue,
    icon: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="482.51" height="374" viewBox="0 0 482.51 374"> <title>mastercard</title> <g> <path d="M220.13,421.67V396.82c0-9.53-5.8-15.74-15.32-15.74-5,0-10.35,1.66-14.08,7-2.9-4.56-7-7-13.25-7a14.07,14.07,0,0,0-12,5.8v-5h-7.87v39.76h7.87V398.89c0-7,4.14-10.35,9.94-10.35s9.11,3.73,9.11,10.35v22.78h7.87V398.89c0-7,4.14-10.35,9.94-10.35s9.11,3.73,9.11,10.35v22.78Zm129.22-39.35h-14.5v-12H327v12h-8.28v7H327V408c0,9.11,3.31,14.5,13.25,14.5A23.17,23.17,0,0,0,351,419.6l-2.49-7a13.63,13.63,0,0,1-7.46,2.07c-4.14,0-6.21-2.49-6.21-6.63V389h14.5v-6.63Zm73.72-1.24a12.39,12.39,0,0,0-10.77,5.8v-5h-7.87v39.76h7.87V399.31c0-6.63,3.31-10.77,8.7-10.77a24.24,24.24,0,0,1,5.38.83l2.49-7.46a28,28,0,0,0-5.8-.83Zm-111.41,4.14c-4.14-2.9-9.94-4.14-16.15-4.14-9.94,0-16.15,4.56-16.15,12.43,0,6.63,4.56,10.35,13.25,11.6l4.14.41c4.56.83,7.46,2.49,7.46,4.56,0,2.9-3.31,5-9.53,5a21.84,21.84,0,0,1-13.25-4.14l-4.14,6.21c5.8,4.14,12.84,5,17,5,11.6,0,17.81-5.38,17.81-12.84,0-7-5-10.35-13.67-11.6l-4.14-.41c-3.73-.41-7-1.66-7-4.14,0-2.9,3.31-5,7.87-5,5,0,9.94,2.07,12.43,3.31Zm120.11,16.57c0,12,7.87,20.71,20.71,20.71,5.8,0,9.94-1.24,14.08-4.56l-4.14-6.21a16.74,16.74,0,0,1-10.35,3.73c-7,0-12.43-5.38-12.43-13.25S445,389,452.07,389a16.74,16.74,0,0,1,10.35,3.73l4.14-6.21c-4.14-3.31-8.28-4.56-14.08-4.56-12.43-.83-20.71,7.87-20.71,19.88h0Zm-55.5-20.71c-11.6,0-19.47,8.28-19.47,20.71s8.28,20.71,20.29,20.71a25.33,25.33,0,0,0,16.15-5.38l-4.14-5.8a19.79,19.79,0,0,1-11.6,4.14c-5.38,0-11.18-3.31-12-10.35h29.41v-3.31c0-12.43-7.46-20.71-18.64-20.71h0Zm-.41,7.46c5.8,0,9.94,3.73,10.35,9.94H364.68c1.24-5.8,5-9.94,11.18-9.94ZM268.59,401.79V381.91h-7.87v5c-2.9-3.73-7-5.8-12.84-5.8-11.18,0-19.47,8.7-19.47,20.71s8.28,20.71,19.47,20.71c5.8,0,9.94-2.07,12.84-5.8v5h7.87V401.79Zm-31.89,0c0-7.46,4.56-13.25,12.43-13.25,7.46,0,12,5.8,12,13.25,0,7.87-5,13.25-12,13.25-7.87.41-12.43-5.8-12.43-13.25Zm306.08-20.71a12.39,12.39,0,0,0-10.77,5.8v-5h-7.87v39.76H532V399.31c0-6.63,3.31-10.77,8.7-10.77a24.24,24.24,0,0,1,5.38.83l2.49-7.46a28,28,0,0,0-5.8-.83Zm-30.65,20.71V381.91h-7.87v5c-2.9-3.73-7-5.8-12.84-5.8-11.18,0-19.47,8.7-19.47,20.71s8.28,20.71,19.47,20.71c5.8,0,9.94-2.07,12.84-5.8v5h7.87V401.79Zm-31.89,0c0-7.46,4.56-13.25,12.43-13.25,7.46,0,12,5.8,12,13.25,0,7.87-5,13.25-12,13.25-7.87.41-12.43-5.8-12.43-13.25Zm111.83,0V366.17h-7.87v20.71c-2.9-3.73-7-5.8-12.84-5.8-11.18,0-19.47,8.7-19.47,20.71s8.28,20.71,19.47,20.71c5.8,0,9.94-2.07,12.84-5.8v5h7.87V401.79Zm-31.89,0c0-7.46,4.56-13.25,12.43-13.25,7.46,0,12,5.8,12,13.25,0,7.87-5,13.25-12,13.25C564.73,415.46,560.17,409.25,560.17,401.79Z" transform="translate(-132.74 -48.5)"/> <g> <rect x="169.81" y="31.89" width="143.72" height="234.42" fill="#ff5f00"/> <path d="M317.05,197.6A149.5,149.5,0,0,1,373.79,80.39a149.1,149.1,0,1,0,0,234.42A149.5,149.5,0,0,1,317.05,197.6Z" transform="translate(-132.74 -48.5)" fill="#eb001b"/> <path d="M615.26,197.6a148.95,148.95,0,0,1-241,117.21,149.43,149.43,0,0,0,0-234.42,148.95,148.95,0,0,1,241,117.21Z" transform="translate(-132.74 -48.5)" fill="#f79e1b"/> </g> </g></svg>`,
  },
};

const SmallCreditCard = ({ data }: SmallCreditCardProps) => {
  const normalizedData = data
    .replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/'/g, '"');
  const card: ICreditCardStripe = JSON.parse(normalizedData);
  return (
    <div style={{ textAlign: "center" }}>
      <div
        className={`${styles.creditcard} ${styles.darkcolor} ${
          CARDS[card.brand]?.darkColor ?? styles.greydark
        }`}
      >
        <div
          id={styles.ccsingle}
          dangerouslySetInnerHTML={{ __html: CARDS[card.brand]?.icon }}
        ></div>
        <div className={styles.cardnumbercontainer}>
          <Typography.Text className={styles.cardnumbertitle}>
            número de tarjeta
          </Typography.Text>
          <Typography.Text
            className={styles.cardnumber}
          >{`**** **** **** ${card.last4}`}</Typography.Text>
        </div>
        <div className={styles.expdatecontainer}>
          <Typography.Text className={styles.expdatetitle}>
            expira
          </Typography.Text>
          <Typography.Text className={styles.expdate}>{`${
            card.exp_month < 10 ? `0${card.exp_month}` : card.exp_month
          }/${card.exp_year.toString().match(/\d{2}$/)}`}</Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default SmallCreditCard;
