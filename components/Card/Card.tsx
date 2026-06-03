import { FC, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Heart from "../../public/icons/Heart";
import styles from "./Card.module.css";
import HeartSolid from "../../public/icons/HeartSolid";
import { itemType } from "../../context/cart/cart-types";
import { useCart } from "../../context/cart/CartProvider";
import { useWishlist } from "../../context/wishlist/WishlistProvider";

type Props = {
  item: itemType;
};

const Card: FC<Props> = ({ item }) => {
  const t = useTranslations("CartWishlist");
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const { addOne } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);

  const { id, name, price, img1, img2 } = item;
  const hasSecondaryImage = !!img2 && img2 !== img1;

  const itemLink = `/products/${encodeURIComponent(id)}`;

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === id).length > 0;

  const handleWishlist = () => {
    alreadyWishlisted ? deleteWishlistItem!(item) : addToWishlist!(item);
  };

  // Soporte de gestos táctiles (Swipe/Deslizar) para dispositivos móviles como Android/iOS (estilo Hugo Boss)
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    // Si el usuario desliza horizontalmente más de 40px, alternamos la imagen (frente / reverso)
    if (Math.abs(difference) > 40) {
      setIsHovered((prev) => !prev);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Link href={itemLink}>
          <a
            tabIndex={-1}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="block relative overflow-hidden select-none"
          >
            {/* Contenedor relativo para el efecto de escala y crossfade */}
            <div className="relative overflow-hidden w-full h-full">
              {/* Imagen frontal (Base) */}
              <div 
                className={`transform transition-all duration-700 ease-in-out ${
                  hasSecondaryImage
                    ? isHovered ? "opacity-0 scale-102" : "opacity-100 scale-100"
                    : isHovered ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={img1 as string}
                  alt={name}
                  width={230}
                  height={300}
                  layout="responsive"
                  priority
                />
              </div>

              {/* Imagen trasera (Reverso) con disolvencia suave y zoom premium */}
              {hasSecondaryImage && (
                <div
                  className={`absolute inset-0 w-full h-full transform transition-all duration-700 ease-in-out ${
                    isHovered
                      ? "opacity-100 scale-105 pointer-events-auto"
                      : "opacity-0 scale-100 pointer-events-none"
                  }`}
                >
                  <Image
                    src={img2 as string}
                    alt={`${name} - Reverso`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
          </a>
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-full"
          aria-label="Wishlist"
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted ? <HeartSolid /> : <Heart />}
        </button>
        <button
          type="button"
          onClick={() => addOne!(item)}
          className={styles.addBtn}
        >
          {t("add_to_cart")}
        </button>
      </div>

      <div className="content">
        <Link href={itemLink}>
          <a className={styles.itemName}>{name}</a>
        </Link>
        <div className="text-gray400">$ {price}</div>
        <button
          type="button"
          onClick={() => addOne!(item)}
          className="uppercase font-bold text-sm sm:hidden"
        >
          {t("add_to_cart")}
        </button>
      </div>
    </div>
  );
};

export default Card;
