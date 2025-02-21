import NavLink from "./NavLink";

const Navigation = () => {
	return (
		<nav className="h-full flex items-end pr-10 ">
			<ul className="flex gap-x-4">
				<li>
					<NavLink href={"/monitor"} title="Monitor" />
				</li>
				<li>
					<NavLink href={"/alerts"} title="Alerts" />
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
