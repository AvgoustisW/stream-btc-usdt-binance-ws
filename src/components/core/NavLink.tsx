import { NavLink as RouterNavLink } from "react-router-dom";

interface NavLinkProps {
	href: string;
	title: string;
}

const NavLink = ({ href, title }: NavLinkProps) => (
	<RouterNavLink
		className={({ isActive }) =>
			`relative group text-2xl transition duration-200 ease-in-out overflow-hidden  text-white ${
				isActive ? "bg-green-500 text-white " : ""
			}`
		}
		to={href}
		title={title}
	>
		<span>{title}</span>
	</RouterNavLink>
);

export default NavLink;
