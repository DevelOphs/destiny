import Link from "next/link";
import { useTranslations } from "next-intl";

import FacebookLogo from "../../public/icons/FacebookLogo";
import InstagramLogo from "../../public/icons/InstagramLogo";
import Button from "../Buttons/Button";
import Input from "../Input/Input";
import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("Navigation");

  return (
    <>
      {/* ===== Footer Promise Bar (Polares de Confianza) ===== */}
      <div className="bg-navy text-white py-6 md:py-8 border-b border-white border-opacity-10 font-sans">
        <div className="app-max-width app-x-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Calidad */}
          <div className="flex items-center space-x-3.5">
            <div className="flex-none p-2 bg-white bg-opacity-10 rounded-full text-white">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs tracking-wider uppercase text-white font-serif">CALIDAD GARANTIZADA</h4>
              <p className="text-xs text-gray300 mt-0.5 leading-relaxed">Productos de alta gama diseñados para clientes y licitaciones exigentes.</p>
            </div>
          </div>

          {/* Pillar 2: Compra Segura */}
          <div className="flex items-center space-x-3.5">
            <div className="flex-none p-2 bg-white bg-opacity-10 rounded-full text-white">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs tracking-wider uppercase text-white font-serif">COMPRA SEGURA</h4>
              <p className="text-xs text-gray300 mt-0.5 leading-relaxed">Tus transacciones y solicitudes están totalmente protegidas con nosotros.</p>
            </div>
          </div>

          {/* Pillar 3: Envíos */}
          <div className="flex items-center space-x-3.5">
            <div className="flex-none p-2 bg-white bg-opacity-10 rounded-full text-white">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v11.177m0 0H9" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs tracking-wider uppercase text-white font-serif">ENVÍOS A TODO EL PAÍS</h4>
              <p className="text-xs text-gray300 mt-0.5 leading-relaxed">Coordinamos la logística y entrega de lotes a cualquier provincia de Ecuador.</p>
            </div>
          </div>

          {/* Pillar 4: Soporte */}
          <div className="flex items-center space-x-3.5">
            <div className="flex-none p-2 bg-white bg-opacity-10 rounded-full text-white">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 11.25a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs tracking-wider uppercase text-white font-serif">ATENCIÓN PERSONALIZADA</h4>
              <p className="text-xs text-gray300 mt-0.5 leading-relaxed">Asesoría directa en diseño y cotización corporativa para tu empresa.</p>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.footerContainer}>
        <div className={`app-max-width app-x-padding ${styles.footerContents}`}>
          <div>
            <h3 className={styles.footerHead}>{t("company")}</h3>
            <div className={styles.column}>
              <Link href="/about-us"><a>{t("about_us")}</a></Link>
              <Link href="/contact"><a>{t("contact_us")}</a></Link>
              <Link href="/coming-soon"><a>{t("store_location")}</a></Link>
              <Link href="/coming-soon"><a>{t("careers")}</a></Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>{t("help")}</h3>
            <div className={styles.column}>
              <Link href="/coming-soon"><a>{t("order_tracking")}</a></Link>
              <Link href="/coming-soon"><a>{t("faqs")}</a></Link>
              <Link href="/coming-soon"><a>{t("privacy_policy")}</a></Link>
              <Link href="/coming-soon"><a>{t("terms_conditions")}</a></Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>{t("store")}</h3>
            <div className={styles.column}>
              <Link href={`/product-category/women`}>
                <a>{t("women")}</a>
              </Link>
              <Link href={`/product-category/men`}>
                <a>{t("men")}</a>
              </Link>
              <Link href={`/product-category/bags`}>
                <a>{t("bags")}</a>
              </Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>{t("keep_in_touch")}</h3>
            <div className={styles.column}>
              <span>
                {t("address.detail")}
                <br />
                {t("address.road")}
                <br />
                {t("address.city")}
              </span>
              <span>{t("phone_number")}</span>
              <span>
                {t("open_all_days")} <br />- {t("opening_hours")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pb-10 md:pb-12 font-sans">
        <h4 className="text-2xl mb-2 font-serif font-semibold text-navy tracking-wide uppercase">{t("newsletter")}</h4>
        <span className="px-6 text-center text-gray400 text-xs">{t("newsletter_desc")}</span>
        <div className="mt-4 px-6 flex w-full sm:w-auto flex-col sm:flex-row">
          <Input
            label="Newsletter Input Box"
            name="email"
            type="email"
            extraClass="w-full sm:w-auto text-xs"
          />{" "}
          <Button
            size="sm"
            value={t("send")}
            extraClass="ml-0 mt-3 sm:mt-0 tracking-widest sm:tracking-normal sm:ml-4 w-auto w-full sm:w-auto !bg-navy hover:!bg-blue text-white border-navy text-xs py-2 px-6"
          />
        </div>
      </div>
      <div className={`${styles.bottomFooter} font-sans`}>
        <div className="app-max-width app-x-padding w-full flex justify-between">
          <span className="text-gray400">@2026 IJ + DESTRIBUIDORA. MÁS QUE PRODUCTOS, UNA IDENTIDAD. {t("all_rights_reserved")}</span>
          <span className="flex items-center space-x-3">
            <span className="hidden sm:block text-gray400">
              {t("follow_us_on_social_media")}:
            </span>{" "}
            <a
              href="https://facebook.com"
              aria-label="Facebook Page for IJ Distribuidora"
              className="text-gray400 hover:text-white"
            >
              <FacebookLogo />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram Account for IJ Distribuidora"
              className="text-gray400 hover:text-white"
            >
              <InstagramLogo />
            </a>
          </span>
        </div>
      </div>
    </>
  );
}
