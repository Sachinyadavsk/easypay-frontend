import { CreditCard, Gift, HelpCircle, Repeat, Settings, ShoppingBag, User } from "lucide-react";

const menuItems = [
    {
        title: 'UPI & Payment Settings',
        desc: 'UPI PIN, Bank Accounts & More',
        icon: CreditCard,
        color: 'text-cyan-600',
        path: '/payment-settings',
    },
    {
        title: 'Automatic Payments',
        desc: 'Manage UPI AutoPay',
        icon: Repeat,
        color: 'text-green-600',
        path: '/automatic-payments',
    },
    {
        title: 'Orders & Bookings',
        desc: 'Payments, Recharge, Travel & Others',
        icon: ShoppingBag,
        color: 'text-orange-600',
        path: '/orders',
    },
    {
        title: 'Profile',
        desc: 'Privacy, Notifications & Language',
        icon: User,
        color: 'text-blue-600',
        path: '/profile',
    },
    {
        title: 'Help & Support',
        desc: 'Customer Support, Queries & FAQs',
        icon: HelpCircle,
        color: 'text-red-600',
        path: '/help-support',
    },
    {
        title: 'Refer & Win',
        desc: 'Earn Cashback Up To ₹200',
        icon: Gift,
        color: 'text-purple-600',
        path: '/refer-earn',
    },
    {
        title: 'Settings',
        desc: 'Security & Preferences',
        icon: Settings,
        color: 'text-gray-600',
        path: '/settings',
    },
]

export default menuItems;