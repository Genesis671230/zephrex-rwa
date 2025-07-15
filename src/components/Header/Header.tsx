import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import mobiusLogo from "../../assets/logo.svg"
// import {
// SignInButton,
// SignUpButton,
// SignedIn,
// SignedOut,
// UserButton,
// useUser,
// } from "@clerk/nextjs";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
	useUser,
} from '@clerk/clerk-react';

// import Link from "next/link";
import { useAccount } from 'wagmi';

import MantaNetworkLogo from '@/assets/manta-network-logo.svg';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuContent,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

const navigation = [
	{
		title: 'Home',
		href: '/',
	},
	{
		title: 'Profile',
		children: [
			{ title: 'History', href: '/history' },
			{ title: 'Settings', href: '/setting' },
		],
	},
];

const ListItem = ({
	title,
	href,
	active,
}: {
	title: string;
	href: string;
	active?: boolean;
}) => (
	<Link
		to={href}
		className={cn(
			'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block rounded-md p-3 leading-none no-underline transition-colors outline-none select-none',
			active && 'bg-accent text-accent-foreground'
		)}
	>
		<div className="text-sm leading-none font-medium">{title}</div>
	</Link>
);

const MantaLogo = () => (
	<a
		href="https://manta.network/"
		target="_blank"
		rel="noreferrer"
		className="flex items-center"
	>
		<img src={MantaNetworkLogo} alt="Manta Logo" />
	</a>
);

const MobileNav = ({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const location = useLocation();

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-full">
				<SheetTitle className="hidden">menu</SheetTitle>
				<nav className="mt-4 flex flex-col space-y-4">
					{navigation.map(item => (
						<div key={item.title} className="space-y-3">
							{item.href ? (
								<Link
									to={item.href}
									className={cn(
										'text-lg font-medium',
										location.pathname === item.href && 'text-primary'
									)}
									onClick={() => onOpenChange(false)}
								>
									{item.title}
								</Link>
							) : (
								<div className="text-lg font-medium">{item.title}</div>
							)}
							{item.children && (
								<div className="space-y-2 pl-4">
									{item.children.map(child => (
										<Link
											key={child.title}
											to={child.href}
											className={cn(
												'text-muted-foreground hover:text-primary block',
												location.pathname === child.href && 'text-primary'
											)}
											onClick={() => onOpenChange(false)}
										>
											{child.title}
										</Link>
									))}
								</div>
							)}
						</div>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
};

const DesktopNav = () => {
	const location = useLocation();

	return (
		<NavigationMenu className="ml-6">
			<NavigationMenuList>
				{navigation.map(item => (
					<NavigationMenuItem key={item.title}>
						{item.children ? (
							<>
								<NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[200px] gap-3 p-4">
										{item.children.map(child => (
											<ListItem
												key={child.title}
												title={child.title}
												href={child.href}
												active={location.pathname === child.href}
											/>
										))}
									</ul>
								</NavigationMenuContent>
							</>
						) : (
							<Link
								to={item.href}
								className={cn(
									navigationMenuTriggerStyle(),
									location.pathname === item.href && 'text-primary'
								)}
							>
								{item.title}
							</Link>
						)}
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default function Header() {
	const { isMobile } = useResponsive();
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	return (
		<div>
			{/* // <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b px-6 backdrop-blur"> */}
			{/* <div className="container flex h-14 items-center justify-between md:justify-start"> */}
			{/* <MantaLogo /> */}
			{/* {isMobile ? ( */}
			{/* // <MobileNav isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} /> */}
			{/* ) : ( */}
			{/* // <DesktopNav /> */}

			<Appbar />
			{/* )} */}
			{/* </div> */}
			{/* // </header> */}
		</div>
	);
}

export function Appbar() {
	const { open } = useAppKit();
	const {address} = useAppKitAccount()
	const { user } = useUser();

		const [isScrolled, setIsScrolled] = useState(false);

		useEffect(() => {
			const handleScroll = () => {
				setIsScrolled(window.scrollY > 100);
			};

			window.addEventListener('scroll', handleScroll);

			return () => {
				window.removeEventListener('scroll', handleScroll);
			};
		}, []);

	return (
		<div className="fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between">
			{/* <Link to="/" className="flex items-center gap-2"> 
	<div className="text-2xl font-bold">DPin Uptime</div> 
	</Link> */}

		<nav className={`sticky top-0 z-50 flex w-full items-center transition-all duration-300 justify-between ${isScrolled?'bg-white': window.location.pathname=="/" ?'bg-transparent':'bg-white'} px-8 py-4 shadow-lg`}>
			<div className="flex items-center gap-2">
				<Link to="/">
				<span className={`flex ml-12 text-2xl font-extrabold tracking-widest ${isScrolled?'text-black':'text-[#10b981]'}`}>
					<img src={mobiusLogo} alt="mobius" />
					</span>
					</Link>
			</div>
			<div className="flex items-center gap-8">
				<Link
					id="tag"
					to="/marketplace"
					className={`text-base transition-all duration-300 font-medium text-black ${!isScrolled && window.location.pathname=="/" ?'text-white':'text-black'} transition hover:text-[#10b981]`}
				>
					Marketplace
				</Link>
				<Link
					id="tag"
					to="/issuer/dashboard"
					className={`text-base transition-all duration-300 font-medium text-black ${!isScrolled && window.location.pathname=="/" ?'text-white':'text-black'} transition hover:text-[#10b981]`}
				>
					Issue Token
				</Link>
				{/* <Link
					id="tag"
					to="#faqs"
					className={`text-base transition-all duration-300 font-medium text-black ${!isScrolled && window.location.pathname=="/" ?'text-white':'text-black'} transition hover:text-[#10b981]`}
				>
					FAQs
				</Link> */}
				{/* <Link
					id="tag"
					to="#media"
					className={`text-base transition-all duration-300 font-medium ${isScrolled && window.location.pathname=="/" ?'text-black':'text-white'} transition hover:text-[#10b981]`}
				>
					Media
				</Link> */}
			</div>
			<div className="flex items-center gap-4">
				<div>

{address ? (
					<motion.div 
						className="group relative overflow-hidden"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						{/* Background with gradient border */}
						<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300" />
						<div className="relative flex items-center gap-3 px-5 py-3 glass-strong rounded-2xl border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-300">
							{/* Status indicator */}
							<div className="flex items-center gap-2">
								<div className="relative">
									<motion.div 
										className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-lg shadow-emerald-400/50"
										animate={{ 
											scale: [1, 1.1, 1],
											boxShadow: [
												"0 0 0 0 rgba(52, 211, 153, 0.4)",
												"0 0 0 8px rgba(52, 211, 153, 0)",
												"0 0 0 0 rgba(52, 211, 153, 0)"
											]
										}}
										transition={{ duration: 2, repeat: Infinity }}
									/>
									<div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-20" />
								</div>
								<Wallet className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-200" />
							</div>
							
							{/* Address display */}
							<div className="flex flex-col">
								<span className="text-xs text-emerald-300/80 font-medium">Connected</span>
								<motion.span 
									className="text-sm font-mono text-white group-hover:text-emerald-100 transition-colors duration-200 select-all cursor-pointer"
									whileHover={{ letterSpacing: "0.05em" }}
									transition={{ duration: 0.15 }}
								>
									{address?.slice(0, 6)}...{address?.slice(-4)}
								</motion.span>
							</div>
							
							{/* Copy indicator */}
							<motion.div
								className="w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
								animate={{ 
									rotate: [0, 360],
								}}
								transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
							/>
						</div>
					</motion.div>
				) : (
					<motion.button
						onClick={() => open()}
						className="group relative overflow-hidden"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						{/* Background with gradient border */}
						<div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-orange-500/20 to-amber-500/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300" />
						<div className="relative flex items-center gap-3 px-5 py-3 glass-strong rounded-2xl border border-rose-500/30 group-hover:border-rose-400/50 transition-all duration-300">
							{/* Status indicator */}
							<div className="flex items-center gap-2">
								<div className="relative">
									<motion.div 
										className="w-3 h-3 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full shadow-lg shadow-rose-400/50"
										animate={{ 
											scale: [1, 1.1, 1],
											boxShadow: [
												"0 0 0 0 rgba(244, 63, 94, 0.4)",
												"0 0 0 8px rgba(244, 63, 94, 0)",
												"0 0 0 0 rgba(244, 63, 94, 0)"
											]
										}}
										transition={{ duration: 2, repeat: Infinity }}
									/>
									<div className="absolute inset-0 w-3 h-3 bg-rose-400 rounded-full animate-ping opacity-20" />
								</div>
								<Wallet className="h-5 w-5 text-rose-400 group-hover:text-rose-300 transition-colors duration-200" />
							</div>
							
							{/* Connect prompt */}
							<div className="flex flex-col">
								<span className="text-xs text-rose-300/80 font-medium">Disconnected</span>
								<span className="text-sm font-semibold text-white group-hover:text-rose-100 transition-colors duration-200">
									Connect Wallet
								</span>
							</div>
							
							{/* Connect indicator */}
							<motion.div
								className="w-2 h-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full"
								animate={{ 
									scale: [1, 1.2, 1],
									opacity: [0.5, 1, 0.5]
								}}
								transition={{ duration: 1.5, repeat: Infinity }}
							/>
						</div>
					</motion.button>
				)}
					<SignedIn>
						<div className="flex gap-2">
							{/* <UserButton /> */}
							<div className="pl-2">
								<p id="tag" className={`font-semibold transition-all duration-300 ${isScrolled?'text-black':'text-white'}`}>
									{/* {user?.fullName || user?.username} */}
								</p>
								<p id="tag" className={`text-xs transition-all duration-300 ${isScrolled?'text-black':'text-white'}`}>
									{/* {address?.slice(0, 6)}...{address?.slice(-4)} */}
								</p>
							</div>
						</div>
					</SignedIn>
				</div>
				<div>
					<SignedOut>
						<SignInButton />
						{/* <SignUpButton /> */}
					</SignedOut>
					<SignedIn>
						<UserButton />
						{/* <div>
							<p className={`font-semibold transition-all duration-300 ${isScrolled?'text-black':'text-white'}`}>
								{user?.fullName || user?.username}
							</p>
						</div> */}
					</SignedIn>
				</div>
			</div>
		</nav>
		</div>
	);
}
