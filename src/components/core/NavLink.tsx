import { Link } from "react-router-dom";

interface NavLinkProps {
	href: string;
	title: string;
}

const NavLink = ({ href, title }: NavLinkProps) => (
	<Link className="relative group text-2xl transition duration-200 ease-in-out overflow-hidden" to={href} title={title}>
		<span className="relative">{title}</span>
		<span className="absolute inset-0 bg-black scale-y-0 origin-bottom transition-transform duration-200 ease-in-out group-hover:scale-y-100 z-[-1]"></span>
	</Link>
);

export default NavLink;
