import { ReactNode } from 'react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { useTranslation } from 'react-i18next';

interface AppLayoutProps {
	children: ReactNode;
	hideBottomNav?: boolean;
}

export function AppLayout({ children, hideBottomNav = false }: AppLayoutProps) {
	const { i18n } = useTranslation();

	return (
		<div className="min-h-screen bg-gradient-subtle">
			<header className="w-full py-3 px-4 flex justify-end max-w-md mx-auto">
				<select
					aria-label="Language"
					className="border rounded-md px-2 py-1 text-sm bg-background"
					value={i18n.language}
					onChange={(e) => i18n.changeLanguage(e.target.value)}
				>
					<option value="en">English</option>
					<option value="es">Español</option>
					<option value="ar">العربية</option>
				</select>
			</header>
			<main className={cn(
				"min-h-screen",
				!hideBottomNav && "pb-20"
			)}>
				{children}
			</main>
			{!hideBottomNav && <BottomNav />}
		</div>
	);
}

function cn(...classes: (string | undefined)[]): string {
	return classes.filter(Boolean).join(' ');
}