import React, { FC } from "react";

interface HeadProps {
  title: string;
  description: string;
  keywords: string;
}

const Heading: FC<HeadProps> = ({ title, description, keywords }) => {
  return (
    <>
      <title>{title}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content={description} name="description" />
      <meta content={keywords} name="keywords" />
    </>
  );
};

export default Heading;
