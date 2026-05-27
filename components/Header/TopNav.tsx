import InstagramLogo from "../../public/icons/InstagramLogo";
import FacebookLogo from "../../public/icons/FacebookLogo";

const TopNav = () => {
  return (
    <div className="bg-navy text-white text-xs py-2 hidden lg:block font-sans">
      <div className="flex justify-between items-center app-max-width app-x-padding">
        {/* Left side: Welcome announcement */}
        <span className="font-normal tracking-wider opacity-90">
          Bienvenido a IJ Distribuidora
        </span>

        {/* Right side: Shipping Info + Social Media Links */}
        <div className="flex items-center space-x-6">
          <span className="font-normal tracking-wider opacity-90">
            Envíos a todo el país
          </span>
          <div className="flex items-center space-x-4 border-l border-white border-opacity-20 pl-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray300 transition-colors duration-200"
              aria-label="IJ Distribuidora Facebook"
            >
              <FacebookLogo />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray300 transition-colors duration-200"
              aria-label="IJ Distribuidora Instagram"
            >
              <InstagramLogo />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
