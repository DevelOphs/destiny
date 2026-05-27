import React from "react";
import Head from "next/head";

type Props = {
  title?: string;
  desc?: string;
  keywords?: string;
};

// "Discover affordable and fashionable men's and women's clothing online at Haru Fashion. Free Returns ✓ 1000+ New Arrivals Dropped Daily."
const defaultDesc =
  "Descubre la colección exclusiva de Destiny. Distribución mayorista y moda premium de alta calidad por IJ Distribuidora.";
const defaultKeywords =
  "Destiny, IJ Distribuidora, Moda Premium, Distribución Mayorista, Ropa, Ecuador, Elegancia, Ropa Táctica, Ropa Casual";

const AppHeader: React.FC<Props> = ({
  title = "Destiny - IJ Distribuidora",
  desc = defaultDesc,
  keywords = defaultKeywords,
}) => {
  return (
    <Head>
      <title>{title}</title>

      <meta content={desc} name="description" key="description" />
      <meta content={keywords} name="keywords" key="keywords" />
      <meta property="og:description" content={desc} key="og_description" />
      <meta property="og:title" content={title} key="og_title" />
      <meta name="twitter:title" content={title} key="twitter_title" />
      <meta
        name="twitter:description"
        content={desc}
        key="twitter_description"
      />
    </Head>
  );
};

export default AppHeader;
