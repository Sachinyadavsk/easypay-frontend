import {
  FaHistory,
  FaMobileAlt,
  FaQrcode,
  FaUniversity
} from "react-icons/fa";

const FaMobileAlticon =<FaMobileAlt />;
const FaQrcodeicon = <FaQrcode />;
const FaUniversityicon = <FaUniversity />;
const FaWalleticon = <FaHistory />;
const transfers = [
  {
    icon: FaQrcodeicon,
    title: "Scan any OR",
    link: "/transfer-scan-anyor"
  },
  {
    icon: FaMobileAlticon,
    title: "To Mobile Number",
    link: "/transfer-to-mobile"
  },
  {
    icon: FaUniversityicon,
    title: "To Bank & Self A/C",
    link: "/transfer-to-bank"
  },

  {
    icon:FaWalleticon,
    title: "Check Balance",
    link: "/check-balance"
  }
];

export default transfers;