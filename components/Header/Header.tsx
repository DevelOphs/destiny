import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import TopNav from "./TopNav";
import WhistlistIcon from "../../public/icons/WhistlistIcon";
import UserIcon from "../../public/icons/UserIcon";
import AuthForm from "../Auth/AuthForm";
import SearchForm from "../SearchForm/SearchForm";
import CartItem from "../CartItem/CartItem";
import Menu from "../Menu/Menu";
import AppHeader from "./AppHeader";
import { useWishlist } from "../../context/wishlist/WishlistProvider";

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title }) => {
  const t = useTranslations("Navigation");
  const { wishlist } = useWishlist();
  const [animate, setAnimate] = useState("");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [didMount, setDidMount] = useState<boolean>(false);

  // Calculate Number of Wishlist items
  const noOfWishlist = wishlist.length;

  // Animate Wishlist Number
  const handleAnimate = useCallback(() => {
    if (noOfWishlist === 0) return;
    setAnimate("animate__animated animate__headShake");
  }, [noOfWishlist]);

  // Set animate when no of wishlist changes
  useEffect(() => {
    handleAnimate();
    const timer = setTimeout(() => {
      setAnimate("");
    }, 1000);
    return () => clearTimeout(timer);
  }, [handleAnimate]);

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 30) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    setDidMount(true);
    window.addEventListener("scroll", handleScroll);
    return () => {
      setDidMount(false);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (!didMount) {
    return null;
  }

  return (
    <>
      {/* ===== App Head Config ===== */}
      <AppHeader title={title} />

      {/* ===== Accessibility Link ===== */}
      <a
        href="#main-content"
        className="whitespace-nowrap absolute z-50 left-4 opacity-90 rounded-md bg-white px-4 py-3 transform -translate-y-40 focus:translate-y-0 transition-all duration-300 font-sans"
      >
        {t("skip_to_main_content")}
      </a>

      {/* ===== Top Announcement Navigation Bar ===== */}
      <TopNav />

      {/* ===== Main Dynamic Header Menu ===== */}
      <nav
        className={`${scrolled ? "bg-white sticky top-0 shadow-md z-50 border-b border-gray100" : "bg-white border-b border-gray100"
          } w-full transition-all duration-300 z-50 h-20 relative font-sans`}
      >
        <div className="app-max-width w-full h-full flex items-center">
          <div className="flex justify-between items-center w-full app-x-padding">

            {/* Hamburger Icon for Mobile view */}
            <div className="flex-none lg:hidden">
              <Menu />
            </div>

            {/* Premium Logo Imagen (Left) - Autocontenido y Responsivo */}
            <div className="flex-none cursor-pointer select-none">
              <Link href="/">
                <a className="flex items-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/bg-img/logo_scorpion.png"
                    alt="IJ Distribuidora"
                    className="h-10 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              </Link>
            </div>

            {/* Desktop Navigation Links (Centered) */}
            <ul className="hidden lg:flex flex-1 justify-center items-center space-x-8 text-sm font-semibold uppercase tracking-wider text-gray500">
              <li>
                <Link href="/#inicio">
                  <a className="hover:text-blue transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-blue">
                    Inicio
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about-us">
                  <a className="hover:text-blue transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-blue">
                    Sobre Nosotros
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/#seccion-destiny">
                  <a className="hover:text-blue transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-blue">
                    Destiny
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="hover:text-blue transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-blue">
                    Productos
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-blue transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-blue">
                    Contacto
                  </a>
                </Link>
              </li>
            </ul>

            {/* Utility Controls: Search, Profile, Wishlist, Cart (Right) */}
            <ul className="flex-none flex items-center space-x-6 sm:space-x-8">
              <li className="hover:text-blue transition-colors duration-200">
                <SearchForm />
              </li>
              <li className="hover:text-blue transition-colors duration-200">
                <AuthForm>
                  <UserIcon />
                </AuthForm>
              </li>
              <li className="hidden sm:block hover:text-blue transition-colors duration-200">
                <Link href="/wishlist" passHref>
                  <button
                    type="button"
                    className="relative flex items-center"
                    aria-label="Ver Favoritos"
                  >
                    <WhistlistIcon />
                    {noOfWishlist > 0 && (
                      <span
                        className={`${animate} absolute text-[10px] -top-2.5 -right-2.5 bg-blue text-white w-5 h-5 flex items-center justify-center rounded-full font-bold`}
                      >
                        {noOfWishlist}
                      </span>
                    )}
                  </button>
                </Link>
              </li>
              <li className="hover:text-blue transition-colors duration-200">
                <CartItem />
              </li>
            </ul>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
